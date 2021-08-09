import { createLogger, EncoderTypeEnum } from "@fwl/logging";

import { CONFIG_VARIABLES } from "./config-variables";

export const logger = createLogger({
  service: CONFIG_VARIABLES.serviceName,
  encoder: EncoderTypeEnum.JSON,
});
