import { getTracer, startTracer, Tracer } from "@fwl/tracing";

import { configVariables } from "@src/configs/config-variables";

console.log(configVariables.fwlTracingCollectors);

startTracer({ collectors: configVariables.fwlTracingCollectors });

function tracer(): Tracer {
  return getTracer();
}

export default tracer;
