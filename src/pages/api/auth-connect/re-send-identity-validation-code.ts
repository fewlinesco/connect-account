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
import { UserCookie } from "@src/@types/user-cookie";
import { insertTemporaryIdentity } from "@src/commands/insert-temporary-identity";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { getIdentityType } from "@src/utils/get-identity-type";

const handler: Handler = (request, response): Promise<void> => {
  return getTracer().span(
    "send-identity-validation-code handler",
    async (span) => {
      if (!request.body.eventId) {
        // WebError
        throw new Error();
      }

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
      });

      if (userCookie) {
        const user = await getDBUserFromSub(userCookie.sub);

        if (!user?.temporary_identities) {
          // WebError
          throw new Error();
        }

        const temporaryIdentity = user.temporary_identities.find(
          ({ eventId }) => eventId === request.body.eventId,
        );

        if (!temporaryIdentity) {
          // WebError
          throw new Error();
        }

        const {
          type,
          value,
          callbackUrl,
          expiresAt,
          primary,
        } = temporaryIdentity;

        const identity = {
          type: getIdentityType(type),
          value: value,
        };

        return await sendIdentityValidationCode(config.managementCredentials, {
          callbackUrl,
          identity,
          localeCodeOverride: "en-EN",
          userId: userCookie.sub,
        })
          .then(async ({ eventId }) => {
            span.setDisclosedAttribute("is validation code sent", true);

            const temporaryIdentity = {
              eventId,
              value,
              type,
              expiresAt,
              primary,
              callbackUrl,
            };

            await insertTemporaryIdentity(userCookie.sub, temporaryIdentity);

            const verificationCodeMessage =
              getIdentityType(type) === IdentityTypes.EMAIL
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
    tracingMiddleware(getTracer()),
    recoveryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    withSentry,
    withAuth,
  ],
  handler,
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
