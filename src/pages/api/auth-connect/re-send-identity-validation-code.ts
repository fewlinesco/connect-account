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
import { UserCookie } from "@src/@types/user-cookie";
import { insertTemporaryIdentity } from "@src/commands/insert-temporary-identity";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { getIdentityType } from "@src/utils/get-identity-type";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityInputCantBeBLank: ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK,
    temporaryIdentityNotFound: ERRORS_DATA.TEMPORARY_IDENTITY_NOT_FOUND,
    temporaryIdentitiesNotFound: ERRORS_DATA.TEMPORARIES_IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
  };

  return getTracer().span(
    "send-identity-validation-code handler",
    async (span) => {
      if (!request.body.eventId) {
        throw webErrorFactory(webErrors.badRequest);
      }

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
      });

      if (userCookie) {
        const user = await getDBUserFromSub(userCookie.sub);

        if (!user?.temporary_identities) {
          throw webErrorFactory(webErrors.temporaryIdentitiesNotFound);
        }

        const temporaryIdentity = user.temporary_identities.find(
          ({ eventId }) => eventId === request.body.eventId,
        );

        if (!temporaryIdentity) {
          throw webErrorFactory(webErrors.temporaryIdentityNotFound);
        }

        const { type, value, expiresAt, primary } = temporaryIdentity;

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

            const temporaryIdentity = {
              eventId,
              value,
              type,
              expiresAt,
              primary,
            };

            await insertTemporaryIdentity(userCookie.sub, temporaryIdentity);

            const verificationCodeMessage =
              getIdentityType(type) === IdentityTypes.EMAIL
                ? "A new confirmation email has been sent"
                : "A new confirmation SMS has been sent";

            setAlertMessagesCookie(response, verificationCodeMessage);

            response.statusCode = HttpStatus.OK;
            response.setHeader("Content-Type", "application/json");
            response.json({ eventId });
            return;
          })
          .catch((error) => {
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

              throw webErrorFactory(webErrors.identityInputCantBeBLank);
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
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
