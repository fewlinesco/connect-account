import * as Sentry from "@sentry/node";
import { NextApiRequest } from "next";

import { config } from "../config";

// Helper to avoid duplicating the `init` call in every `/pages/api` file.
// Also used in `pages/_app` for the client side, which automatically applies it for all frontend pages.
Sentry.init({
  dsn: config.connectAccountPublicSentryDSN,
  enabled: process.env.NODE_ENV !== "test",
});

Sentry.configureScope((scope) => {
  scope.setTag("Node environment", process.env.NODE_ENV);
});

export const configureReq = (req: NextApiRequest): void => {
  Sentry.configureScope((scope) => {
    scope.setTag(
      "host",
      req.headers && req.headers["host"] ? req.headers["host"] : "",
    );
    scope.setTag("url", req.url ? req.url : "");
    scope.setTag("method", req.method ? req.method : "");
    scope.setContext("query", req.query);
    scope.setContext("cookies", req.cookies);
    scope.setContext("body", req.body);
    scope.setContext("headers", req.headers);
  });
};

export default Sentry;
