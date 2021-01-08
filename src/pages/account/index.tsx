import type { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";

import { AccountOverview } from "@src/components/account-overview/account-overview";
import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/layout";
import { deviceBreakpoints } from "@src/design-system/theme";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewaresForSSR } from "@src/middlewares/wrapper";

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

export default AccountPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return wrapMiddlewaresForSSR(context, [withLogger, withSentry, withAuth]);
};

export const WelcomeMessage = styled.h1`
  margin-top: 0.5rem;
  margin-bottom: 5rem;

  @media ${deviceBreakpoints.m} {
    margin-bottom: 4rem;
  }
`;
