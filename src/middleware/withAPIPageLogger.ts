import { createLogger } from "@fewlines/fwl-logging";
import { NextApiRequest, NextApiResponse } from "next";

type T = (
  request: NextApiRequest,
  response: NextApiResponse,
) => Promise<JSON | void>;

export function withAPIPageLogger(APIPageFetch: T): T {
  const logger = createLogger("connect-account", "json").withMeta({
    process: "getServerSideProps",
  });

  const processTimeStart = process.hrtime.bigint();
  const processTimeEnd = process.hrtime.bigint();

  return APIPageFetch;
}
