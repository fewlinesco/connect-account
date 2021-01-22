import { Endpoint, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { removeIdentityFromUser } from "@lib/commands/remove-identity-from-user";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const tracer = getTracer();

const handler = (
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> => {
  return tracer.span("delete-identity handler", async (span) => {
    const { userId, type, value } = request.body;

    span.setDisclosedAttribute("Identity type", type);

    if (request.method === "DELETE") {
      return removeIdentityFromUser({ userId, type, value }).then((data) => {
        response.statusCode = HttpStatus.ACCEPTED;

        response.setHeader("Content-Type", "application/json");

        response.end(JSON.stringify({ data }));
      });
    }

    response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;
    response.end();

    return Promise.reject();
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(tracer),
    recoveryMiddleware(tracer),
    errorMiddleware(tracer),
    loggingMiddleware(tracer, logger),
    withSentry,
    withAuth,
  ],
  handler,
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
