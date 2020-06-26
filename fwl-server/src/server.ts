import { Logger } from "@fewlines/fwl-logging";
import { Tracer } from "@fewlines/fwl-tracing";
import { createApp, loggingMiddleware, Router } from "@fewlines/fwl-web";
import { Application } from "express";

import { pingHandler } from "./handlers/ping";
import * as user from "./handlers/user";

export function start(tracer: Tracer, logger: Logger): Application {
  const router = new Router(tracer, logger);

  router.get<{}>("/ping", pingHandler());
  router.get<user.QueryParams>("user", user.userHandler());

  return createApp(router, [loggingMiddleware(tracer, logger)]);
}
