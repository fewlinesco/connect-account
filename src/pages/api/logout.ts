import { deleteServerSideCookie, Endpoint, HttpStatus } from "@fwl/web";
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
import { logger } from "@src/config/logger";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = (_request, response): Promise<void> => {
  const webErrors = {
    cookieDeletionFailed: ERRORS_DATA.COOKIE_DELETION_FAILED,
  };

  return getTracer().span("logout handler", async (span) => {
    await deleteServerSideCookie(response, "user-cookie").catch(() => {
      span.setDisclosedAttribute("user logged out", false);

      throw webErrorFactory(webErrors.cookieDeletionFailed);
    });

    span.setDisclosedAttribute("user logged out", true);

    response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
    response.setHeader("location", "/");
    response.end();
    return;
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
  ],
  handler,
  "/api/logout",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
