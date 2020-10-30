import { createLogger, EncoderTypeEnum } from "@fwl/logging";
import { NextApiResponse } from "next";

import { Handler } from "../@types/ApiPageHandler";
import { ExtendedRequest } from "../@types/ExtendedRequest";

export function withAPIPageLogger(
  handler: Handler,
): (request: ExtendedRequest, response: NextApiResponse) => void {
  const logger = createLogger({
    service: "connect-account",
    encoder: EncoderTypeEnum.JSON,
  }).withMeta({
    process: "apiPage",
  });

  const processTimeStart = process.hrtime.bigint();

  return async (
    request: ExtendedRequest,
    response: NextApiResponse,
  ): Promise<void> => {
    response.once("finish", () => {
      const processTimeEnd = process.hrtime.bigint();

      logger.log("Success", {
        method: request.method ? request.method : "No method",
        statusCode: request.statusCode ? request.statusCode : 0,
        path: request.url ? request.url : "No path",
        duration: (
          (processTimeEnd - processTimeStart) /
          BigInt(1000)
        ).toString(),
      });
    });

    await handler(request, response);
  };
}
