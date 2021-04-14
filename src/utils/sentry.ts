import * as Sentry from "@sentry/node";
import { IncomingMessage } from "http";
import type { NextApiRequest } from "next";

// Helper to avoid duplicating the `init` call in every `/pages/api` file.
// Also used in `pages/_app` for the client side, which automatically applies it for all frontend pages.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === "development"
        ? false
        : process.env.NODE_ENV === "production",
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  });
}

Sentry.configureScope((scope) => {
  console.log("😮", scope);
  scope.setTag("Node environment", process.env.NODE_ENV);
});

const addRequestScopeToSentry = (
  request: NextApiRequest | IncomingMessage,
): void => {
  const headers = Object.entries(request.headers).reduce(
    (acc, [key, value]) =>
      !["cookie", "authorization"].includes(key.toLowerCase())
        ? { ...acc, [key]: value }
        : acc,
    {},
  );

  Sentry.configureScope((scope) => {
    scope.setTag("url", request.url ? request.url : "");
    scope.setTag("method", request.method ? request.method : "");

    if ("query" in request) {
      scope.setContext("query", request.query);
      scope.setContext("body", request.body);
    }

    scope.setContext("headers", headers);
  });
};

export { addRequestScopeToSentry };
export default Sentry;
