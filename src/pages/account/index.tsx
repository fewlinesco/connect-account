import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import { useIntl } from "react-intl";

import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { AccountOverview } from "@src/components/pages/account-overview/account-overview";
import { logger } from "@src/configs/logger";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const AccountPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <Layout breadcrumbs={false} title={formatMessage({ id: "breadcrumb" })}>
      <Container>
        <AccountOverview />
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account",
  );
};

export { getServerSideProps };
export default AccountPage;
