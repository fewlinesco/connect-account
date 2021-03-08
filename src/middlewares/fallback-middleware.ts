import { Tracer } from "@fwl/tracing";
import { HttpStatus } from "@fwl/web";
import { Middleware } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

function fallback(
  tracer: Tracer,
  response: NextApiResponse,
  error: Record<string, unknown>,
): Promise<void> {
  return tracer.span("fallback-middleware", async (span) => {
    const startTime = process.hrtime.bigint();

    span.setDisclosedAttribute("error", true);
    span.setDisclosedAttribute("internal.error", true);
    span.setDisclosedAttribute("http.status_code_group", "5xx");

    console.log(error.httpStatus);

    if (error instanceof Error) {
      span.setDisclosedAttribute("exception.class", error.toString());
      span.setDisclosedAttribute("exception.message", error.message);
      span.setDisclosedAttribute("stack_trace_hash", error.stack);
    } else {
      span.setDisclosedAttribute("exception.class", error.toString());
    }

    const endTime = process.hrtime.bigint();
    const duration = ((endTime - startTime) / BigInt(1000000)).toString();

    span.setDisclosedAttribute("middlewares.recovery.duration_in_ms", duration);

    response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    response.end();
    throw error;
  });
}

function fallbackMiddleware(
  tracer: Tracer,
): Middleware<NextApiRequest, NextApiResponse> {
  return (handler) => {
    return async function withFwlRecoveryErrorHandler(
      request: NextApiRequest,
      response: NextApiResponse,
    ): Promise<void> {
      return handler(request, response).catch(
        async (error: Record<string, unknown>) => {
          throw await fallback(tracer, response, error);
        },
      );
    };
  };
}

export { fallbackMiddleware };
