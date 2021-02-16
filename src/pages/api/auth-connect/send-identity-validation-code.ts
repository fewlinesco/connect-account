import {
  IdentityValueCantBeBlankError,
  sendIdentityValidationCode,
  IdentityAlreadyUsedError,
  IdentityTypes,
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

const tracer = getTracer();

const handler: Handler = (request, response): Promise<void> => {
  return tracer.span(
    "re-send-identity-validation-code handler",
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

            await insertTemporaryIdentity(userCookie.sub, temporaryIdentity);

            const verificationCodeMessage =
              getIdentityType(identityInput.type) === IdentityTypes.EMAIL
                ? "Confirmation email has been sent"
                : "Confirmation SMS has been sent";

            setAlertMessagesCookie(response, verificationCodeMessage);

            response.statusCode = HttpStatus.OK;
            response.setHeader("Content-Type", "application/json");
            response.json({ eventId });
            return;
          })
          .catch((error) => {
            if (
              error instanceof IdentityAlreadyUsedError ||
              error instanceof IdentityValueCantBeBlankError
            ) {
              span.setDisclosedAttribute(
                "Identity input exception",
                error.message,
              );

              response.statusCode = HttpStatus.BAD_REQUEST;
              response.json({ errorMessage: error.message });
              return;
            }

            response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            response.end();
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
    tracingMiddleware(tracer),
    recoveryMiddleware(tracer),
    errorMiddleware(tracer),
    loggingMiddleware(tracer, logger),
    withSentry,
    withAuth,
  ],
  handler,
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
