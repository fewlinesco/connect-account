import { createLogger } from "@fewlines/fwl-logging";
import { GetServerSideProps } from "next";
import { GetServerSidePropsResult } from "next";

export function withSSRLogger(
  getServerSideProps: GetServerSideProps,
): GetServerSideProps {
  const logger = createLogger("connect-account", "json").withMeta({
    process: "getServerSideProps",
  });

  const processTimeStart = process.hrtime.bigint();

  return async (context) => {
    return getServerSideProps(context)
      .then(
        (
          serverSidePropsResult: GetServerSidePropsResult<{
            [key: string]: Record<string, unknown>;
          }>,
        ) => {
          const processTimeEnd = process.hrtime.bigint();

          logger.log("Success", {
            method: context.req.method,
            statusCode: context.res.statusCode,
            path: context.req.url,
            duration: Number(
              (processTimeEnd - processTimeStart) / BigInt(1000),
            ),
          });

          return serverSidePropsResult;
        },
      )
      .catch((error: Error) => {
        const processTimeEnd = process.hrtime.bigint();

        logger.log(error.message, {
          method: context.req.method,
          statusCode: context.res.statusCode,
          path: context.req.url,
          duration: (
            (processTimeEnd - processTimeStart) /
            BigInt(1000)
          ).toString(),
        });

        throw error;
      });
  };
}
