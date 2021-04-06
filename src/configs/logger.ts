import { createLogger, EncoderTypeEnum } from "@fwl/logging";

import { configVariables } from "./config-variables";

export const logger = createLogger({
  service: configVariables.serviceName,
  encoder: EncoderTypeEnum.JSON,
});
