import { Tracer } from "@fwl/tracing";
import { Middleware } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

async function sentryReport(
  tracer: Tracer,
  error: Record<string, unknown>,
  request: NextApiRequest,
): Promise<void> {
  return tracer.span("sentry-middleware", async (span) => {
    addRequestScopeToSentry(request);

    span.setDisclosedAttribute("http.status_code", error.httpStatus);
    span.setDisclosedAttribute("error.name", error.name);
    span.setDisclosedAttribute("error.message", error.message);

    Sentry.withScope((scope) => {
      scope.setTag(request.url || "no URL found", error.name as string);
      scope.setTag("trace.id", span.getTraceId());
      Sentry.captureException(error);
    });

    throw error;
  });
}

function sentryMiddleware(
  tracer: Tracer,
): Middleware<NextApiRequest, NextApiResponse> {
  return (handler) => {
    return async (
      request: NextApiRequest,
      response: NextApiResponse,
    ): Promise<void> => {
      console.log("FLAG sentry middleware");

      try {
        return await handler(request, response);
      } catch (error) {
        console.log("error");

        await sentryReport(tracer, error, request);
      }
    };
  };
}

export { sentryMiddleware };
