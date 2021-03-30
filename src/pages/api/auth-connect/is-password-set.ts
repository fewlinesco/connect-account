import {
  ConnectUnreachableError,
  GraphqlErrors,
  isUserPasswordSet,
} from "@fewlines/connect-management";
import { Endpoint, getServerSideCookies, HttpStatus } from "@fwl/web";
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
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
  };

  return getTracer().span("is-password-set handler", async (_span) => {
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

    const isPasswordSet = await isUserPasswordSet(
      config.managementCredentials,
      userCookie.sub,
    ).catch((error) => {
      if (error instanceof GraphqlErrors) {
        throw webErrorFactory({
          ...webErrors.identityNotFound,
          parentError: error,
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

    response.statusCode = HttpStatus.OK;
    response.json({ isPasswordSet });
  });
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
  "/api/auth-connect/is-password-set",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
