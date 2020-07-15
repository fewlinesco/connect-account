import { Logger } from "@fewlines/fwl-logging";
import { Tracer } from "@fewlines/fwl-tracing";
import { createApp, loggingMiddleware, Router } from "@fewlines/fwl-web";
import cors from "cors";
import { Application } from "express";

import * as addIdentity from "./handlers/addIdentityHandler";
import * as deleteIdentity from "./handlers/deleteIdentityHandler";
import { pingHandler } from "./handlers/pingHandler";
import * as user from "./handlers/userHandler";
import * as getProfile from "./handlers/getUserProfileHandler";

export function start(tracer: Tracer, logger: Logger): Application {
  const router = new Router(tracer, logger);

  router.get<{}>("/ping", pingHandler());

  // Identities through `connect-management`.
  router.post<any, user.QueryParams>("/user", user.userHandler());
  router.post<any, addIdentity.QueryParams>(
    "/user/identities",
    addIdentity.handler(),
  );
  router.delete<any, deleteIdentity.QueryParams>(
    "/user/identities",
    deleteIdentity.handler(),
  );

  // Profile infos through `connect-profile`.
  router.get<{}>("/user/profile", getProfile.handler());

  return createApp(router, [loggingMiddleware(tracer, logger), cors()]);
}
