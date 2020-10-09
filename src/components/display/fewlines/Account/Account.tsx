import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { BoxedLink } from "../BoxedLink/BoxedLink";
import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { IdentityContainer } from "../IdentityContainer/IdentityContainer";
import { NeutralLink } from "../NeutralLink/NeutralLink";

const Account: React.FC = () => {
  return (
    <Container>
      <Head>
        <title>Connect Account</title>
      </Head>
      <H1>Welcome to your account</H1>
      <SubTitle>First name last name</SubTitle>
      <IdentityContainer>
        <Link href="/account/logins">
          <NeutralLink>
            <BoxedLink value="Logins" primary={true} status="validated" />
          </NeutralLink>
        </Link>
      </IdentityContainer>
    </Container>
  );
};

export default Account;

export const SubTitle = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: ${({ theme }) => theme.fontSizes.s};
  margin: 0 0 ${({ theme }) => theme.spaces.s} 0;
`;
