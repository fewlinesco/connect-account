import { createLogger } from "@fewlines/fwl-logging";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "../@types/ApiPageHandler";

export function withAPIPageLogger(
  handler: Handler,
): (request: NextApiRequest, response: NextApiResponse) => Promise<void> {
  const logger = createLogger("connect-account", "json").withMeta({
    process: "getServerSideProps",
  });

  const processTimeStart = process.hrtime.bigint();

  return async (
    request: NextApiRequest,
    response: NextApiResponse,
  ): Promise<void> => {
    await handler(request)
      .then(() => {
        const processTimeEnd = process.hrtime.bigint();

        logger.log("Success", {
          method: request.method,
          statusCode: request.statusCode,
          path: request.url,
          duration: Number((processTimeEnd - processTimeStart) / BigInt(1000)),
        });

        response.statusCode = 200;
      })
      .catch((error: Error) => {
        const processTimeEnd = process.hrtime.bigint();

        console.log(error);

        logger.log(error.message, {
          method: request.method,
          statusCode: request.statusCode,
          path: request.url,
          duration: (
            (processTimeEnd - processTimeStart) /
            BigInt(1000)
          ).toString(),
        });

        response.statusCode = 400;
      });
  };
}
