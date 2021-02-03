import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";

import { Layout } from "@src/components/page-layout";
import { Locale } from "@src/components/pages/locale/locale";
import { logger } from "@src/logger";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const LocalePage: React.FC = () => {
  return (
    <Layout>
      <Locale />
    </Layout>
  );
};

export default LocalePage;

const tracer = getTracer();

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(context, [
    tracingMiddleware(tracer),
    recoveryMiddleware(tracer),
    errorMiddleware(tracer),
    loggingMiddleware(tracer, logger),
    withSentry,
  ]);
};
