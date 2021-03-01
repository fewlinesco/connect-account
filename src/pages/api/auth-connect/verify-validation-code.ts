import {
  addIdentityToUser,
  getIdentity,
  removeIdentityFromUser,
  checkVerificationCode,
  markIdentityAsPrimary,
  GraphqlErrors,
  ConnectUnreachableError,
} from "@fewlines/connect-management";
import { Endpoint, HttpStatus, getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { removeTemporaryIdentity } from "@src/commands/remove-temporary-identity";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import getTracer from "@src/tracer";
import { getIdentityType } from "@src/utils/get-identity-type";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = async (request, response) => {
  const webErrors = {
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    temporaryIdentityNotFound: ERRORS_DATA.TEMPORARY_IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    invalidBody: ERRORS_DATA.INVALID_BODY,
    invalidValidationCode: ERRORS_DATA.INVALID_VALIDATION_CODE,
    temporaryIdentityExpired: ERRORS_DATA.TEMPORARY_IDENTITY_EXPIRED,
    noUserFound: ERRORS_DATA.NO_USER_FOUND,
  };

  return getTracer().span("verify-validation-code handler", async (span) => {
    const { validationCode, eventId } = request.body;

    if ([validationCode, eventId].includes(undefined)) {
      throw webErrorFactory(webErrors.invalidBody);
    }

    const userCookie = (await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: config.cookieSalt,
    })) as UserCookie;

    const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
      span.setDisclosedAttribute("database reachable", false);
      span.setDisclosedAttribute("exception.message", error.message);

      throw webErrorFactory(webErrors.databaseUnreachable);
    });

    if (!user) {
      span.setDisclosedAttribute("user found", false);

      throw webErrorFactory(webErrors.noUserFound);
    }

    span.setDisclosedAttribute("user found", true);

    const temporaryIdentity = user.temporary_identities.find(({ eventIds }) => {
      return eventIds.find((eventId) => eventId === request.body.eventId);
    });

    if (temporaryIdentity) {
      span.setDisclosedAttribute("is temporary Identity found", true);

      if (temporaryIdentity.expiresAt > Date.now()) {
        span.setDisclosedAttribute("is temporary Identity expired", false);

        const { status: verificationStatus } = await checkVerificationCode(
          config.managementCredentials,
          {
            code: validationCode,
            eventId,
          },
        ).catch((error) => {
          if (error instanceof GraphqlErrors) {
            throw webErrorFactory(webErrors.identityNotFound);
          }

          if (error instanceof ConnectUnreachableError) {
            throw webErrorFactory(webErrors.connectUnreachable);
          }

          throw error;
        });

        const { value, type, primary, identityToUpdateId } = temporaryIdentity;

        if (verificationStatus === "VALID") {
          span.setDisclosedAttribute("is temporary Identity valid", true);

          const { id: identityId } = await addIdentityToUser(
            config.managementCredentials,
            {
              userId: userCookie.sub,
              identityType: getIdentityType(type),
              identityValue: value,
            },
          ).catch((error) => {
            if (error instanceof GraphqlErrors) {
              throw webErrorFactory(webErrors.identityNotFound);
            }

            if (error instanceof ConnectUnreachableError) {
              throw webErrorFactory(webErrors.connectUnreachable);
            }

            throw error;
          });

          await removeTemporaryIdentity(
            userCookie.sub,
            temporaryIdentity,
          ).catch(() => {
            span.setDisclosedAttribute("database reachable", false);

            throw webErrorFactory(webErrors.databaseUnreachable);
          });

          if (primary) {
            span.setDisclosedAttribute("is temporary Identity primary", true);

            await markIdentityAsPrimary(
              config.managementCredentials,
              identityId,
            ).catch((error) => {
              if (error instanceof GraphqlErrors) {
                throw webErrorFactory(webErrors.identityNotFound);
              }

              if (error instanceof ConnectUnreachableError) {
                throw webErrorFactory(webErrors.connectUnreachable);
              }

              throw error;
            });
          }

          span.setDisclosedAttribute("is temporary Identity primary", false);

          if (identityToUpdateId) {
            const identityToUpdate = await getIdentity(
              config.managementCredentials,
              { userId: userCookie.sub, identityId: identityToUpdateId },
            ).catch((error) => {
              if (error instanceof GraphqlErrors) {
                throw webErrorFactory(webErrors.identityNotFound);
              }

              if (error instanceof ConnectUnreachableError) {
                throw webErrorFactory(webErrors.connectUnreachable);
              }

              throw error;
            });

            await removeIdentityFromUser(config.managementCredentials, {
              userId: userCookie.sub,
              identityType: getIdentityType(type),
              identityValue: identityToUpdate ? identityToUpdate.value : "",
            }).catch((error) => {
              if (error instanceof GraphqlErrors) {
                throw webErrorFactory(webErrors.identityNotFound);
              }

              if (error instanceof ConnectUnreachableError) {
                throw webErrorFactory(webErrors.connectUnreachable);
              }

              throw error;
            });
          }

          response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
            Location: "/account/logins",
          });

          return response.end();
        } else if (verificationStatus === "INVALID") {
          span.setDisclosedAttribute("is temporary Identity valid", false);

          throw webErrorFactory(webErrors.invalidValidationCode);
        } else {
          response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
            Location: `/account/logins/${type}/validation/${eventId}`,
          });
        }
      } else {
        span.setDisclosedAttribute("temporary Identity expired", true);

        await removeTemporaryIdentity(userCookie.sub, temporaryIdentity).catch(
          () => {
            span.setDisclosedAttribute("database reachable", false);

            throw webErrorFactory(webErrors.databaseUnreachable);
          },
        );

        throw webErrorFactory(webErrors.temporaryIdentityExpired);
      }
    } else {
      span.setDisclosedAttribute("is temporary Identity found", false);

      throw webErrorFactory(webErrors.temporaryIdentityNotFound);
    }
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  handler,
  "/api/auth-connect/verify-validation-code",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
