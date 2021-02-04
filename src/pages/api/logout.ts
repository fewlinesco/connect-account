import { deleteServerSideCookie, Endpoint, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { DeleteUserCookieError } from "@src/errors";
import { logger } from "@src/logger";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const tracer = getTracer();

const handler: Handler = (_request, response): Promise<void> => {
  return tracer.span("logout handler", async (span) => {
    await deleteServerSideCookie(response, "user-cookie").catch(() => {
      span.setDisclosedAttribute("User logged out", false);

      throw new DeleteUserCookieError(
        "Error deleting UserCookie for login out",
      );
    });

    span.setDisclosedAttribute("User logged out", true);

    response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
    response.setHeader("location", "/");
    response.end();
    return;
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(tracer),
    recoveryMiddleware(tracer),
    errorMiddleware(tracer),
    loggingMiddleware(tracer, logger),
    withSentry,
  ],
  handler,
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
