import { getTracer, startTracer, Tracer } from "@fwl/tracing";

startTracer({
  simpleCollector: {
    serviceName: "connect-account",
    url: "http://localhost:9411/api/v2/spans",
  },
});

export default function (): Tracer {
  return getTracer();
}
