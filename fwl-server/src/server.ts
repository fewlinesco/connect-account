import { Logger } from "@fewlines/fwl-logging";
import { Tracer } from "@fewlines/fwl-tracing";
import { createApp, loggingMiddleware, Router } from "@fewlines/fwl-web";
import { Application } from "express";

import * as identities from "./handlers/identities";
import { pingHandler } from "./handlers/ping";
import * as user from "./handlers/user";

export function start(tracer: Tracer, logger: Logger): Application {
  const router = new Router(tracer, logger);

  router.get<{}>("/ping", pingHandler());
  router.get<user.QueryParams>("/user/identities", user.userHandler());
  router.post<identities.QueryParams, any>(
    "/user/identities",
    user.userHandler(),
  );

  return createApp(router, [loggingMiddleware(tracer, logger)]);
}
