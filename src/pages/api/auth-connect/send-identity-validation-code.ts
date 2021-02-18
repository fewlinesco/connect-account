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
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { UserCookie } from "@src/@types/user-cookie";
import { insertTemporaryIdentity } from "@src/commands/insert-temporary-identity";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import { getIdentityType } from "@src/utils/get-identity-type";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityInputCantBeBlank: ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
  };

  return getTracer().span(
    "send-identity-validation-code handler",
    async (span) => {
      const { callbackUrl, identityInput, identityToUpdateId } = request.body;

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
      });

      if (userCookie) {
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
              eventId: eventId,
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
              span.setDisclosedAttribute("database reachable", false);
              span.setDisclosedAttribute("exception.message", error.message);

              throw webErrorFactory(webErrors.databaseUnreachable);
            });

            const verificationCodeMessage =
              getIdentityType(identityInput.type) === IdentityTypes.EMAIL
                ? "A confirmation email has been sent"
                : "A confirmation SMS has been sent";

            setAlertMessagesCookie(response, verificationCodeMessage);

            response.statusCode = HttpStatus.OK;
            response.setHeader("Content-Type", "application/json");
            response.json({ eventId });
            return;
          })
          .catch((error) => {
            span.setDisclosedAttribute("is validation code sent", false);

            if (error instanceof IdentityAlreadyUsedError) {
              span.setDisclosedAttribute(
                "Identity input already used",
                error.message,
              );

              throw webErrorFactory(webErrors.badRequest);
            }

            if (error instanceof IdentityValueCantBeBlankError) {
              span.setDisclosedAttribute(
                "Identity input can't be blank",
                error.message,
              );

              throw webErrorFactory(webErrors.identityInputCantBeBlank);
            }

            if (error instanceof ConnectUnreachableError) {
              span.setDisclosedAttribute("Connect unreachable", error.message);

              throw webErrorFactory(webErrors.connectUnreachable);
            }

            throw error;
          });
      }

      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    },
  );
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    recoveryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    withSentry,
    withAuth,
  ],
  handler,
  "/api/auth-connect/send-identity-validation-code",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
