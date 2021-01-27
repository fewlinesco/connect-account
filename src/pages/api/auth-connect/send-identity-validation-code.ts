import {
  IdentityValueCantBeBlankError,
  sendIdentityValidationCode,
  IdentityAlreadyUsedError,
} from "@fewlines/connect-management";
import { HttpStatus } from "@fwl/web";

import { Handler } from "@src/@types/core/Handler";
import { UserCookie } from "@src/@types/user-cookie";
import { insertTemporaryIdentity } from "@src/commands/insert-temporary-identity";
import { config } from "@src/config";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { getIdentityType } from "@src/utils/get-identity-type";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

const handler: Handler = async (request, response) => {
  if (request.method === "POST") {
    const { callbackUrl, identityInput } = request.body;

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
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
          const temporaryIdentity = {
            eventId: eventId,
            value: identityInput.value,
            type: identityInput.type,
            expiresAt: identityInput.expiresAt,
            primary: identityInput.primary,
          };

          await insertTemporaryIdentity(userCookie.sub, temporaryIdentity);

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
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;
  return Promise.reject();
};

export default wrapMiddlewares([withLogger, withSentry, withAuth], handler);
