import { Tracer } from "@fewlines/fwl-tracing";
import { HandlerPromise, HttpStatus, ResolveFunction } from "@fewlines/fwl-web";

export function pingHandler() {
  return (tracer: Tracer, resolve: ResolveFunction): HandlerPromise => {
    return tracer.span("ping-handler", async () => {
      return resolve(HttpStatus.OK, "OK");
    });
  };
}
