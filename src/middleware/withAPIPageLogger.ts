import { createLogger } from "@fewlines/fwl-logging";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "../@types/ApiPageHandler";

export function withAPIPageLogger(
  handler: Handler,
): (request: NextApiRequest, response: NextApiResponse) => void {
  const logger = createLogger("connect-account", "json").withMeta({
    process: "apiPage",
  });

  const processTimeStart = process.hrtime.bigint();

  return async (
    request: NextApiRequest,
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
