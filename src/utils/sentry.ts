import * as Sentry from "@sentry/nextjs";
import { IncomingMessage } from "http";
import type { NextApiRequest } from "next";

// Sentry.configureScope((scope) => {
//   scope.setTag("Node environment", process.env.NODE_ENV);
// });

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
