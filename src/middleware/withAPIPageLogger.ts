import { createLogger } from "@fewlines/fwl-logging";
import { NextApiRequest, NextApiResponse } from "next";
import { Handler } from "src/pages/api/identity";

type WithAPIPageLogger = (
  request: NextApiRequest,
  response: NextApiResponse,
) => Promise<JSON | void>;

export function withAPIPageLogger(handler: Handler): WithAPIPageLogger {
  const logger = createLogger("connect-account", "json").withMeta({
    process: "getServerSideProps",
  });

  const processTimeStart = process.hrtime.bigint();

  return async (request, response) => {
    handler(request, response)
      .then((data) => {
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

        response.statusCode = 200;

        return response.json({ data });
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

        return response.json({ error: "Could not perform action" });
      });
  };
}
