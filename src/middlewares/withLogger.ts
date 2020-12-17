import { createLogger, EncoderTypeEnum } from "@fwl/logging";
import { log } from "console";
import { ServerResponse } from "http";

import { ExtendedRequest } from "../@types/core/ExtendedRequest";
import { Handler } from "../@types/core/Handler";

const logger = createLogger({
  service: "connect-account",
  encoder: EncoderTypeEnum.JSON,
}).withMeta({
  process: "server-side",
});

export function withLogger(handler: Handler): Handler {
  return async (request: ExtendedRequest, response: ServerResponse) => {
    const processTimeStart = process.hrtime.bigint();

    try {
      const nextHandler = await handler(request, response);

      const processTimeEnd = process.hrtime.bigint();

      logger.log("No error thrown", {
        duration: (
          (processTimeEnd - processTimeStart) /
          BigInt(1000)
        ).toString(),
        method: request.method ? request.method : "Undefined method",
        path: request.url ? request.url : "Undefined request URL",
        remoteaddr: request.headers["x-forwarded-for"]
          ? request.headers["x-forwarded-for"].toString()
          : "",
        statusCode: response.statusCode ? response.statusCode : 0,
      });

      return nextHandler;
    } catch (error) {
      const processTimeEnd = process.hrtime.bigint();
      console.log("LOGGER", error);
      logger.log(error ? error.message : "error undefined", {
        duration: (
          (processTimeEnd - processTimeStart) /
          BigInt(1000)
        ).toString(),
        method: request.method ? request.method : "Undefined method",
        path: request.url ? request.url : "Undefined request URL",
        remoteaddr: request.headers["x-forwarded-for"]
          ? request.headers["x-forwarded-for"].toString()
          : "",
        statusCode: response.statusCode ? response.statusCode : 0,
      });

      throw error;
    }
  };
}
