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
import { logger } from "@src/logger";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = (_request, response): Promise<void> => {
  const webErrors = {
    unexpectedError: ERRORS_DATA.UNEXPECTED_ERROR,
  };

  return getTracer().span("logout handler", async (span) => {
    await deleteServerSideCookie(response, "user-cookie").catch(() => {
      span.setDisclosedAttribute("user logged out", false);

      throw webErrorFactory(webErrors.unexpectedError);
    });

    span.setDisclosedAttribute("user logged out", true);

    response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
    response.setHeader("location", "/");
    response.end();
    return;
  });
};

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(
    wrapMiddlewares(
      [
        tracingMiddleware(getTracer()),
        recoveryMiddleware(getTracer()),
        errorMiddleware(getTracer()),
        loggingMiddleware(getTracer(), logger),
        withSentry,
      ],
      handler,
    ),
  )
  .getHandler();
