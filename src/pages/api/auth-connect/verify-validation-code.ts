import {
  ConnectUnreachableError,
  updateIdentityFromUser,
  InvalidValidationCodeError,
  IdentityNotFoundError,
  GraphqlErrors,
  addIdentityToUser,
  markIdentityAsPrimary,
} from "@fewlines/connect-management";
import { Endpoint, getServerSideCookies, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { removeTemporaryIdentity } from "@src/commands/remove-temporary-identity";
import { config } from "@src/config";
import { NoUserFoundError } from "@src/errors";
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
    temporaryIdentityListNotFound:
      ERRORS_DATA.TEMPORARY_IDENTITY_LIST_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    invalidBody: ERRORS_DATA.INVALID_BODY,
    invalidValidationCode: ERRORS_DATA.INVALID_VALIDATION_CODE,
    temporaryIdentityExpired: ERRORS_DATA.TEMPORARY_IDENTITY_EXPIRED,
    noUserFound: ERRORS_DATA.NO_USER_FOUND,
  };

  return getTracer().span("verify-validation-code handler", async (span) => {
    const { validationCode, eventId } = request.body;

    if (!validationCode || !eventId) {
      throw webErrorFactory(webErrors.invalidBody);
    }

    const userCookie = (await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: config.cookieSalt,
    })) as UserCookie;

    const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
      span.setDisclosedAttribute("database reachable", false);
      throw webErrorFactory({
        ...webErrors.databaseUnreachable,
        parentError: error,
      });
    });

    if (!user) {
      span.setDisclosedAttribute("user found", false);
      throw webErrorFactory(webErrors.noUserFound);
    }

    span.setDisclosedAttribute("user found", true);

    if (!user.temporary_identities) {
      span.setDisclosedAttribute("temporary identity list found", false);
      throw webErrorFactory(webErrors.temporaryIdentityListNotFound);
    }
    span.setDisclosedAttribute("temporary identity list found", true);

    const temporaryIdentity = user.temporary_identities.find(({ eventIds }) => {
      if (eventIds) {
        return eventIds.find((inDbEventId) => inDbEventId === eventId);
      }

      return;
    });

    if (!temporaryIdentity) {
      span.setDisclosedAttribute("is temporary Identity found", false);
      throw webErrorFactory(webErrors.temporaryIdentityNotFound);
    }
    span.setDisclosedAttribute("is temporary Identity found", true);

    if (temporaryIdentity.expiresAt < Date.now()) {
      span.setDisclosedAttribute("is temporary Identity expired", true);
      throw webErrorFactory(webErrors.temporaryIdentityExpired);
    }
    span.setDisclosedAttribute("is temporary Identity expired", false);

    const {
      value,
      type,
      primary,
      eventIds,
      identityToUpdateId,
    } = temporaryIdentity;

    if (identityToUpdateId) {
      return await updateIdentityFromUser(
        config.managementCredentials,
        user.sub,
        validationCode,
        eventIds,
        value,
        identityToUpdateId,
      )
        .then(async () => {
          span.setDisclosedAttribute("is Identity updated", true);

          await removeTemporaryIdentity(
            userCookie.sub,
            temporaryIdentity,
          ).catch((error) => {
            if (error instanceof NoUserFoundError) {
              span.setDisclosedAttribute("user found", false);
              throw webErrorFactory({
                ...webErrors.noUserFound,
                parentError: error,
              });
            }

            span.setDisclosedAttribute("database reachable", false);
            throw webErrorFactory({
              ...webErrors.databaseUnreachable,
              parentError: error,
            });
          });

          response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
            Location: "/account/logins",
          });

          response.end();
          return;
        })
        .catch((error) => {
          span.setDisclosedAttribute("is Identity updated", false);

          if (error instanceof IdentityNotFoundError) {
            throw webErrorFactory(webErrors.identityNotFound);
          }

          if (error instanceof InvalidValidationCodeError) {
            throw webErrorFactory(webErrors.invalidValidationCode);
          }

          if (error instanceof GraphqlErrors) {
            throw webErrorFactory({
              ...webErrors.identityNotFound,
              parentError: error,
            });
          }

          if (error instanceof ConnectUnreachableError) {
            throw webErrorFactory({
              ...webErrors.connectUnreachable,
              parentError: error,
            });
          }

          throw error;
        });
    }

    const { id: identityId } = await addIdentityToUser(
      config.managementCredentials,
      validationCode,
      eventIds,
      {
        userId: userCookie.sub,
        identityType: getIdentityType(type),
        identityValue: value,
      },
    ).catch((error) => {
      if (error instanceof InvalidValidationCodeError) {
        throw webErrorFactory(webErrors.invalidValidationCode);
      }

      if (error instanceof GraphqlErrors) {
        throw webErrorFactory({
          ...webErrors.identityNotFound,
          parentError: error,
        });
      }

      if (error instanceof ConnectUnreachableError) {
        throw webErrorFactory({
          ...webErrors.connectUnreachable,
          parentError: error,
        });
      }

      throw error;
    });

    if (primary) {
      span.setDisclosedAttribute("is temporary Identity primary", true);

      await markIdentityAsPrimary(
        config.managementCredentials,
        identityId,
      ).catch((error) => {
        if (error instanceof GraphqlErrors) {
          throw webErrorFactory({
            ...webErrors.identityNotFound,
            parentError: error,
          });
        }

        if (error instanceof ConnectUnreachableError) {
          throw webErrorFactory({
            ...webErrors.connectUnreachable,
            parentError: error,
          });
        }

        throw error;
      });
    }
    span.setDisclosedAttribute("is temporary Identity primary", false);

    await removeTemporaryIdentity(userCookie.sub, temporaryIdentity).catch(
      (error) => {
        span.setDisclosedAttribute("database reachable", false);
        throw webErrorFactory({
          ...webErrors.databaseUnreachable,
          parentError: error,
        });
      },
    );

    response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
      Location: "/account/logins",
    });

    response.end();
    return;
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, {
      windowMs: 300000,
      requestsUntilBlock: 200,
    }),
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
