import { startTracer } from "@fewlines/fwl-tracing";

import config from "./config";

startTracer({ serviceName: config.tracing.serviceName });
