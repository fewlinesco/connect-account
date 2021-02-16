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

const handler: Handler = (_request, response): Promise<void> => {
  return getTracer().span("logout handler", async (span) => {
    await deleteServerSideCookie(response, "user-cookie").catch(() => {
      span.setDisclosedAttribute("user logged out", false);

      throw new DeleteUserCookieError(
        "Error deleting UserCookie for login out",
      );
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
    recoveryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    withSentry,
  ],
  handler,
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
