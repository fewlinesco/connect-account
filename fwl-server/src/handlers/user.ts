
import { Tracer } from "@fewlines/fwl-tracing";
import { HandlerPromise, HttpStatus, ResolveFunction } from "@fewlines/fwl-web";

export function userHandler() {
  return (tracer: Tracer, resolve: ResolveFunction): HandlerPromise => {
    return tracer.span("user-handler", async () => {
      return resolve(HttpStatus.OK, "OK");
    });
  };
}