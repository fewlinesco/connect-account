import { createLogger } from "@fewlines/fwl-logging";
import { HttpStatus } from "@fewlines/fwl-web";
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

        response.statusCode = HttpStatus.OK;
      })
      .catch((error: Error) => {
        const processTimeEnd = process.hrtime.bigint();

        logger.log(error.message, {
          method: request.method,
          statusCode: request.statusCode,
          path: request.url,
          duration: (
            (processTimeEnd - processTimeStart) /
            BigInt(1000)
          ).toString(),
        });

        response.statusCode = HttpStatus.BAD_REQUEST;
      });
  };
}
