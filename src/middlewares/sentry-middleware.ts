import { Tracer } from "@fwl/tracing";
import { WebError } from "@fwl/web/dist/errors";
import { Middleware } from "@fwl/web/dist/middlewares";
import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

function wrappedSentryMiddleware(
  tracer: Tracer,
): Middleware<NextApiRequest, NextApiResponse> {
  return (handler) => {
    return async (
      request: NextApiRequest,
      response: NextApiResponse,
    ): Promise<void> => {
      return tracer.span("sentry-middleware", async (span) => {
        try {
          return await withSentry(handler)(request, response);
        } catch (error) {
          if (error instanceof WebError) {
            span.setDisclosedAttribute("web-error", true);
            span.setDisclosedAttribute("http.status_code", error.httpStatus);
            span.setDisclosedAttribute("error.name", error.name);
            span.setDisclosedAttribute("error.message", error.message);
          }

          span.setDisclosedAttribute("web-error", false);
          throw error;
        }
      });
    };
  };
}

export { wrappedSentryMiddleware };
