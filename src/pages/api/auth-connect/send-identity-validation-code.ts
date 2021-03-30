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
import { isValidPhoneNumber } from "react-phone-number-input";

import { Handler } from "@src/@types/handler";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { UserCookie } from "@src/@types/user-cookie";
import { insertTemporaryIdentity } from "@src/commands/insert-temporary-identity";
import { config } from "@src/config";
import { logger } from "@src/config/logger";
import { NoUserFoundError } from "@src/errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { generateAlertMessage } from "@src/utils/generateAlertMessage";
import { getIdentityType } from "@src/utils/get-identity-type";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityInputCantBeBlank: ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK,
    invalidPhoneNumberInput: ERRORS_DATA.INVALID_PHONE_NUMBER_INPUT,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    noUserFound: ERRORS_DATA.NO_USER_FOUND,
  };

  return getTracer().span(
    "send-identity-validation-code handler",
    async (span) => {
      const { callbackUrl, identityInput, identityToUpdateId } = request.body;

      if (!identityInput.value) {
        throw webErrorFactory(webErrors.identityInputCantBeBlank);
      }

      if (
        getIdentityType(identityInput.type) === IdentityTypes.PHONE &&
        !isValidPhoneNumber(identityInput.value)
      ) {
        throw webErrorFactory(webErrors.invalidPhoneNumberInput);
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

      const identity = {
        type: getIdentityType(identityInput.type),
        value: identityInput.value,
      };

      return await sendIdentityValidationCode(config.managementCredentials, {
        callbackUrl,
        identity,
        localeCodeOverride: "en-EN",
        userId: userCookie.sub,
      })
        .then(async ({ eventId }) => {
          span.setDisclosedAttribute("is validation code sent", true);

          let temporaryIdentity: TemporaryIdentity = {
            eventIds: [eventId],
            value: identityInput.value,
            type: identityInput.type,
            expiresAt: identityInput.expiresAt,
            primary: identityInput.primary,
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
            getIdentityType(identityInput.type) === IdentityTypes.EMAIL
              ? "A confirmation email has been sent"
              : "A confirmation SMS has been sent";

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
            throw webErrorFactory(webErrors.identityInputCantBeBlank);
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
  "/api/auth-connect/send-identity-validation-code",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
