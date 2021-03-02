import {
  ConnectUnreachableError,
  createOrUpdatePassword,
  InvalidPasswordInputError,
} from "@fewlines/connect-management";
import { Endpoint, HttpStatus, getServerSideCookies } from "@fwl/web";
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
import { config } from "@src/config";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

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
      cookieSalt: config.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }

    return createOrUpdatePassword(config.managementCredentials, {
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
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, {
      windowMs: 5000,
      requestsUntilBlock: 20,
    }),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  handler,
  "/api/auth-connect/set-password",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
