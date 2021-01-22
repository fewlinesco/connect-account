import { createLogger, EncoderTypeEnum } from "@fwl/logging";

export const logger = createLogger({
  service: "connect-account",
  encoder: EncoderTypeEnum.JSON,
});
