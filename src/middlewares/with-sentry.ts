import { Handler } from "@src/@types/handler";
import getTracer from "@src/tracer";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const tracer = getTracer();

export function withSentry(handler: Handler): Handler {
  return async (request, response) => {
    return tracer.span("withSentry middleware", async (span) => {
      addRequestScopeToSentry(request);

      try {
        return await handler(request, response);
      } catch (error) {
        span.setDisclosedAttribute("error.name", error.name);
        span.setDisclosedAttribute("http.status_code", error.httpStatus);
        span.setDisclosedAttribute("error.message", error.message);

        Sentry.withScope((scope) => {
          scope.setTag(request.url || "/", error.name);
          Sentry.captureException(error);
        });

        throw error;
      }
    });
  };
}
