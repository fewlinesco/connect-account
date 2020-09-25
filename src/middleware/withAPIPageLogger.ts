import { createLogger } from "@fewlines/fwl-logging";
import { NextApiResponse } from "next";

import { Handler } from "../@types/ApiPageHandler";
import { ExtendedRequest } from "../@types/ExtendedRequest";

export function withAPIPageLogger(
  handler: Handler,
): (request: ExtendedRequest, response: NextApiResponse) => void {
  const logger = createLogger("connect-account", "json").withMeta({
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
        method: request.method,
        statusCode: request.statusCode,
        path: request.url,
        duration: (
          (processTimeEnd - processTimeStart) /
          BigInt(1000)
        ).toString(),
      });
    });

    await handler(request, response);
  };
}
