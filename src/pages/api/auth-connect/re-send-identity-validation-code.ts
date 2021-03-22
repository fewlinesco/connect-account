import {
  IdentityValueCantBeBlankError,
  sendIdentityValidationCode,
  IdentityAlreadyUsedError,
  IdentityTypes,
  ConnectUnreachableError,
} from "@fewlines/connect-management";
import { getTracer } from "@fwl/tracing";
import {
  Endpoint,
  HttpStatus,
  getServerSideCookies,
  setAlertMessagesCookie,
} from "@fwl/web";
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
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { UserCookie } from "@src/@types/user-cookie";
import { insertTemporaryIdentity } from "@src/commands/insert-temporary-identity";
import { config } from "@src/config";
import { NoUserFoundError } from "@src/errors";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { generateAlertMessage } from "@src/utils/generateAlertMessage";
import { getIdentityType } from "@src/utils/get-identity-type";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityInputCantBeBLank: ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK,
    temporaryIdentityNotFound: ERRORS_DATA.TEMPORARY_IDENTITY_NOT_FOUND,
    temporaryIdentitiesNotFound: ERRORS_DATA.TEMPORARY_IDENTITY_LIST_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    noUserFound: ERRORS_DATA.NO_USER_FOUND,
  };

  return getTracer().span(
    "re-send-identity-validation-code handler",
    async (span) => {
      const { eventId } = request.body;

      if (!eventId) {
        throw webErrorFactory(webErrors.badRequest);
      }

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
      });

      if (!userCookie) {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        response.end();
        return;
      }

      const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
        span.setDisclosedAttribute("database reachable", false);
        throw webErrorFactory({
          ...webErrors.databaseUnreachable,
          parentError: error,
        });
      });

      if (!user?.temporary_identities) {
        span.setDisclosedAttribute("user found", false);
        throw webErrorFactory(webErrors.temporaryIdentitiesNotFound);
      }
      span.setDisclosedAttribute("user found", true);

      const temporaryIdentity = user.temporary_identities.find(
        ({ eventIds }) => {
          if (eventIds) {
            return eventIds.find((inDbEventId) => inDbEventId === eventId);
          }

          return;
        },
      );

      if (!temporaryIdentity) {
        span.setDisclosedAttribute("is temporary Identity found", false);
        throw webErrorFactory(webErrors.temporaryIdentityNotFound);
      }
      span.setDisclosedAttribute("is temporary Identity found", true);

      const {
        type,
        value,
        expiresAt,
        primary,
        eventIds,
        identityToUpdateId,
      } = temporaryIdentity;

      const identity = {
        type: getIdentityType(type),
        value: value,
      };

      return await sendIdentityValidationCode(config.managementCredentials, {
        callbackUrl: "/",
        identity,
        localeCodeOverride: "en-EN",
        userId: userCookie.sub,
      })
        .then(async ({ eventId }) => {
          span.setDisclosedAttribute("is validation code sent", true);
          let temporaryIdentity: TemporaryIdentity = {
            eventIds: [...eventIds, eventId],
            value,
            type,
            expiresAt,
            primary,
          };

          if (identityToUpdateId) {
            temporaryIdentity = {
              ...temporaryIdentity,
              identityToUpdateId,
            };
          }

          await insertTemporaryIdentity(
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

          const verificationCodeMessage =
            getIdentityType(type) === IdentityTypes.EMAIL
              ? "A new confirmation email has been sent"
              : "A new confirmation SMS has been sent";

          setAlertMessagesCookie(response, [
            generateAlertMessage(verificationCodeMessage),
          ]);

          response.statusCode = HttpStatus.OK;
          response.setHeader("Content-Type", "application/json");
          response.json({ eventId });
          return;
        })
        .catch((error) => {
          span.setDisclosedAttribute("is validation code sent", false);

          if (error instanceof IdentityAlreadyUsedError) {
            throw webErrorFactory(webErrors.badRequest);
          }

          if (error instanceof IdentityValueCantBeBlankError) {
            throw webErrorFactory(webErrors.identityInputCantBeBLank);
          }

          if (error instanceof ConnectUnreachableError) {
            throw webErrorFactory({
              ...webErrors.connectUnreachable,
              parentError: error,
            });
          }

          throw error;
        });
    },
  );
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
  "/api/auth-connect/re-send-identity-validation-code",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
