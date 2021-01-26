import {
  createOrUpdatePassword,
  InvalidPasswordInputError,
} from "@fewlines/connect-management";
import { HttpStatus } from "@fwl/web";

import { Handler } from "@src/@types/core/Handler";
import { UserCookie } from "@src/@types/user-cookie";
import { config } from "@src/config";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

const handler: Handler = async (request, response) => {
  if (request.method === "POST") {
    const { passwordInput } = request.body;

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
    });

    if (userCookie) {
      return createOrUpdatePassword(config.managementCredentials, {
        cleartextPassword: passwordInput,
        userId: userCookie.sub,
      })
        .then(() => {
          response.setHeader("Content-Type", "application/json");
          response.statusCode = HttpStatus.OK;
          response.end();
          return;
        })
        .catch((error) => {
          if (error instanceof InvalidPasswordInputError) {
            response.setHeader("Content-Type", "application/json");
            response.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            response.json({ restrictionRulesError: error.rules });
            return;
          }

          response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          response.end();
          return;
        });
    }
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares([withLogger, withSentry, withAuth], handler);
