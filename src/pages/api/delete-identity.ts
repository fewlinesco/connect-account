import { removeIdentityFromUser } from "@fewlines/connect-management";
import { Endpoint, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const tracer = getTracer();

const handler: Handler = (request, response): Promise<void> => {
  return tracer.span("delete-identity handler", async (span) => {
    const { userId, type, value } = request.body;

    span.setDisclosedAttribute("Identity type", type);

    return removeIdentityFromUser(config.managementCredentials, {
      userId,
      identityType: type,
      identityValue: value,
    }).then(() => {
      span.setDisclosedAttribute("is Identity removed", true);

      response.statusCode = HttpStatus.ACCEPTED;
      response.setHeader("Content-Type", "application/json");
      response.end();
      return;
    });
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
  .delete(wrappedHandler)
  .getHandler();
