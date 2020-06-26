import { createLogger } from "@fewlines/fwl-logging";
import { getTracer } from "@fewlines/fwl-tracing";

import config from "./config";
import * as server from "./server";

const logger = createLogger("fwl-sparta-api");
const tracer = getTracer();

server.start(tracer, logger).listen(config.http.port, () => {
  logger.log(`Server started on http://localhost:${config.http.port}`);
});
