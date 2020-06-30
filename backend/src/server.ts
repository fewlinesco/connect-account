import { Logger } from "@fewlines/fwl-logging";
import { Tracer } from "@fewlines/fwl-tracing";
import { createApp, loggingMiddleware, Router } from "@fewlines/fwl-web";
import cors from "cors";
import { Application } from "express";

import * as addIdentity from "./handlers/addIdentityHandler";
import * as deleteIdentity from "./handlers/deleteIdentityHandler";
import { pingHandler } from "./handlers/ping";
import * as user from "./handlers/user";

export function start(tracer: Tracer, logger: Logger): Application {
  const router = new Router(tracer, logger);

  router.get<{}>("/ping", pingHandler());
  router.post<any, user.QueryParams>("/user", user.userHandler());
  router.post<any, addIdentity.QueryParams>(
    "/user/identities",
    addIdentity.handler(),
  );
  router.delete<any, deleteIdentity.QueryParams>(
    "/user/identities",
    deleteIdentity.handler(),
  );

  return createApp(router, [loggingMiddleware(tracer, logger), cors()]);
}
