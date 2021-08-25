import { Tracer } from "@fwl/tracing";
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
          span.setDisclosedAttribute("http.status_code", error.httpStatus);
          span.setDisclosedAttribute("error.name", error.name);
          span.setDisclosedAttribute("error.message", error.message);

          throw error;
        }
      });
    };
  };
}

export { wrappedSentryMiddleware };
