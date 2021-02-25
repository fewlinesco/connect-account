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
import { AccountOverview } from "@src/components/pages/account-overview/account-overview";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const AccountPage: React.FC = () => {
  return (
    <Layout title="Welcome to your account">
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
      recoveryMiddleware(getTracer()),
      withSentry,
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account",
  );
};

export { getServerSideProps };
export default AccountPage;
