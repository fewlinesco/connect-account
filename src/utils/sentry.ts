import { Span } from "@fwl/tracing";
import * as Sentry from "@sentry/node";
import { IncomingMessage } from "http";
import type { NextApiRequest } from "next";

// Helper to avoid duplicating the `init` call in every `/pages/api` file.
// Also used in `pages/_app` for the client side, which automatically applies it for all frontend pages.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled:
      process.env.SENTRY_ENVIRONMENT === "development"
        ? false
        : process.env.NODE_ENV === "production",
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  });
}

Sentry.configureScope((scope) => {
  scope.setTag("Node environment", process.env.NODE_ENV);
});

const addRequestScopeToSentry = (
  request: NextApiRequest | IncomingMessage,
  span: Span,
): void => {
  const headers = Object.entries(request.headers).reduce(
    (acc, [key, value]) =>
      !["cookie", "authorization"].includes(key.toLowerCase())
        ? { ...acc, [key]: value }
        : acc,
    {},
  );

  Sentry.configureScope((scope) => {
    scope.setTag("urls", request.url ? request.url : "");
    scope.setTag("method", request.method ? request.method : "");
    scope.setTag(
      "trace id",
      span.getTraceId() ? span.getTraceId() : "No trace id found",
    );

    if ("query" in request) {
      scope.setContext("query", request.query);
      scope.setContext("body", request.body);
    }

    scope.setContext("headers", headers);
  });
};

export { addRequestScopeToSentry };
export default Sentry;
