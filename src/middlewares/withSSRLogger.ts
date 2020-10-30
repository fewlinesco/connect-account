import { createLogger, EncoderTypeEnum } from "@fwl/logging";
import { GetServerSideProps } from "next";
import { GetServerSidePropsResult } from "next";

export function withSSRLogger(
  getServerSideProps: GetServerSideProps,
): GetServerSideProps {
  const logger = createLogger({
    service: "connect-account",
    encoder: EncoderTypeEnum.JSON,
  }).withMeta({
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
            method: context.req.method ? context.req.method : "No method",
            statusCode: context.res.statusCode ? context.res.statusCode : 0,
            path: context.req.url ? context.req.url : "No path",
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
          method: context.req.method ? context.req.method : "No method",
          statusCode: context.res.statusCode,
          path: context.req.url ? context.req.url : "No path",
          duration: (
            (processTimeEnd - processTimeStart) /
            BigInt(1000)
          ).toString(),
        });

        throw error;
      });
  };
}
