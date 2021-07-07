import { Logger } from "@fwl/logging";
import { Tracer } from "@fwl/tracing";
import {
  errorMiddleware,
  httpsRedirectMiddleware,
  loggingMiddleware,
  Middleware,
  rateLimitingMiddleware,
  recoveryMiddleware,
  tracingMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { authMiddleware } from "./auth-middleware";
import { wrappedSentryMiddleware } from "./sentry-middleware";
import rateLimitingConfig from "@src/configs/rate-limiting-config";

const noAuthBasicMiddlewares = (
  tracer: Tracer,
  logger: Logger,
): Middleware<NextApiRequest, NextApiResponse>[] => [
  tracingMiddleware(tracer),
  rateLimitingMiddleware(tracer, logger, rateLimitingConfig),
  recoveryMiddleware(tracer),
  errorMiddleware(tracer),
  wrappedSentryMiddleware(tracer),
  loggingMiddleware(tracer, logger),
  httpsRedirectMiddleware(tracer),
];

const basicMiddlewares = (
  tracer: Tracer,
  logger: Logger,
): Middleware<NextApiRequest, NextApiResponse>[] => [
  ...noAuthBasicMiddlewares(tracer, logger),
  authMiddleware(tracer),
];

export { basicMiddlewares, noAuthBasicMiddlewares };
