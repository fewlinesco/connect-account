import { createLogger, EncoderTypeEnum } from "@fwl/logging";
import { ServerResponse } from "http";

import { ExtendedRequest } from "../@types/ExtendedRequest";
import { Handler } from "../@types/Handler";

const logger = createLogger({
  service: "connect-account",
  encoder: EncoderTypeEnum.JSON,
}).withMeta({
  process: "apiPage",
});

export function withLogger(handler: Handler): Handler {
  return async (request: ExtendedRequest, response: ServerResponse) => {
    const processTimeStart = process.hrtime.bigint();

    const result = await handler(request, response);

    const processTimeEnd = process.hrtime.bigint();

    logger.log("Success", {
      method: request.method ? request.method : "No method",
      statusCode: request.statusCode ? request.statusCode : 0,
      path: request.url ? request.url : "No path",
      duration: ((processTimeEnd - processTimeStart) / BigInt(1000)).toString(),
    });

    return result;
  };
}
