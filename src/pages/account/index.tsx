import type { GetServerSideProps } from "next";
import React from "react";
import styled from "styled-components";

import { Layout } from "@src/components/Layout";
import { AccountOverview } from "@src/components/display/fewlines/AccountOverview/AccountOverview";
import { Container } from "@src/components/display/fewlines/Container";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { deviceBreakpoints } from "@src/design-system/theme";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
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
  return wrapMiddlewaresForSSR(context, [
    withLogger,
    withSentry,
    withSession,

    withAuth,
  ]);
};

export const WelcomeMessage = styled(H1)`
  margin-top: 0.5rem;
  margin-bottom: 5rem;

  @media ${deviceBreakpoints.m} {
    margin-bottom: 4rem;
  }
`;
