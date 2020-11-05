import { createLogger, EncoderTypeEnum } from "@fwl/logging";
import { ServerResponse } from "http";

import { ExtendedRequest } from "../@types/ExtendedRequest";
import { Handler } from "../@types/Handler";

const logger = createLogger({
  service: "connect-account",
  encoder: EncoderTypeEnum.JSON,
}).withMeta({
  process: "serverSide",
});

export function withLogger(handler: Handler): Handler {
  return async (request: ExtendedRequest, response: ServerResponse) => {
    const processTimeStart = process.hrtime.bigint();

    response.once("finish", function () {
      const processTimeEnd = process.hrtime.bigint();

      logger.log("", {
        duration: (
          (processTimeEnd - processTimeStart) /
          BigInt(1000)
        ).toString(),
        method: request.method ? request.method : "No method",
        path: request.url ? request.url : "",
        remoteaddr: request.headers["x-forwarded-for"]
          ? request.headers["x-forwarded-for"].toString()
          : "",
        statusCode: response.statusCode ? response.statusCode : 0,
      });
    });

    return handler(request, response);
  };
}
