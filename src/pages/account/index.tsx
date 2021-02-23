import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";

import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { AccountOverview } from "@src/components/pages/account-overview/account-overview";
import { deviceBreakpoints } from "@src/design-system/theme";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";

const AccountPage: React.FC = () => {
  return (
    <Layout>
      <Container>
        <WelcomeMessage>Welcome to your account</WelcomeMessage>
        <AccountOverview />
      </Container>
    </Layout>
  );
};

const WelcomeMessage = styled.h1`
  margin-top: 0.5rem;
  margin-bottom: 5rem;

  @media ${deviceBreakpoints.m} {
    margin-bottom: 4rem;
  }
`;

const tracer = getTracer();

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares(
    context,
    [
      tracingMiddleware(tracer),
      recoveryMiddleware(tracer),
      withSentry,
      errorMiddleware(tracer),
      loggingMiddleware(tracer, logger),
      withAuth,
    ],
    "/account",
  );
};

export { getServerSideProps };
export default AccountPage;
