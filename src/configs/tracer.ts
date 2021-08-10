import { getTracer, startTracer, Tracer } from "@fwl/tracing";

import { CONFIG_VARIABLES } from "@src/configs/config-variables";

startTracer({ collectors: CONFIG_VARIABLES.fwlTracingCollectors });

function tracer(): Tracer {
  return getTracer();
}

export default tracer;
