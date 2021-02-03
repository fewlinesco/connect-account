import { createLogger, EncoderTypeEnum } from "@fwl/logging";

import { Handler } from "../@types/core/handler";

const logger = createLogger({
  service: "connect-account",
  encoder: EncoderTypeEnum.JSON,
}).withMeta({
  process: "server-side",
});

export function withLogger(handler: Handler): Handler {
  return async (request, response) => {
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

      logger.log(error.message, {
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
