import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";

import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { Locale } from "@src/components/pages/locale/locale";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const LocalePage: React.FC = () => {
  return (
    <Layout title="Switch Language">
      <Container>
        <Locale />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      tracingMiddleware(getTracer()),
      recoveryMiddleware(getTracer()),
      withSentry,
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/locale",
  );
};

export { getServerSideProps };
export default LocalePage;
