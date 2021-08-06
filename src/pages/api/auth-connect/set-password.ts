import {
  ConnectUnreachableError,
  createOrUpdatePassword,
  InvalidPasswordInputError,
} from "@fewlines/connect-management";
import { Endpoint, HttpStatus, getServerSideCookies } from "@fwl/web";
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";

const handler: Handler = async (request, response) => {
  const webErrors = {
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    invalidPasswordInput: ERRORS_DATA.INVALID_PASSWORD_INPUT,
    invalidBody: ERRORS_DATA.INVALID_BODY,
  };

  return getTracer().span("set-password handler", async (span) => {
    const { passwordInput } = request.body;

    if (!passwordInput) {
      throw webErrorFactory(webErrors.invalidBody);
    }

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: configVariables.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }

    return createOrUpdatePassword(configVariables.managementCredentials, {
      cleartextPassword: passwordInput,
      userId: userCookie.sub,
    })
      .then((isUpdated) => {
        span.setDisclosedAttribute("password created or updated", true);

        response.setHeader("Content-Type", "application/json");
        response.statusCode = HttpStatus.OK;
        response.json({ isUpdated });
        return;
      })
      .catch((error) => {
        span.setDisclosedAttribute("password created or updated", false);

        if (error instanceof InvalidPasswordInputError) {
          span.setDisclosedAttribute("invalid password input", true);
          throw webErrorFactory({
            ...webErrors.invalidPasswordInput,
            errorDetails: error.rules,
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
  });
};

const wrappedHandler = wrapMiddlewares(
  basicMiddlewares(getTracer(), logger),
  handler,
  "/api/auth-connect/set-password/",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
