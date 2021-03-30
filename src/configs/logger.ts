import { createLogger, EncoderTypeEnum } from "@fwl/logging";

import { config } from "../config";

export const logger = createLogger({
  service: config.serviceName,
  encoder: EncoderTypeEnum.JSON,
});
