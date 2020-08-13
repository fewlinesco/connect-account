import * as Sentry from "@sentry/node";
import { NextApiRequest } from "next";

// Helper to avoid duplicating the `init` call in every `/pages/api` file.
// Also used in `pages/_app` for the client side, which automatically applies it for all frontend pages.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: process.env.NODE_ENV !== "test",
  });
}

Sentry.configureScope((scope) => {
  scope.setTag("Node environment", process.env.NODE_ENV);
});

export const configureReq = (request: NextApiRequest): void => {
  const headers = Object.entries(request.headers).reduce(
    (acc, [key, value]) => (key !== "cookie" ? { ...acc, [key]: value } : acc),
    {},
  );

  Sentry.configureScope((scope) => {
    scope.setTag(
      "host",
      request.headers && request.headers["host"] ? request.headers["host"] : "",
    );
    scope.setTag("url", request.url ? request.url : "");
    scope.setTag("method", request.method ? request.method : "");
    scope.setContext("query", request.query);
    scope.setContext("body", request.body);
    scope.setContext("headers", headers);
  });
};

export default Sentry;
