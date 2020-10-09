import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { IdentityContainer } from "../IdentityContainer/IdentityContainer";
import { LoginsIcon } from "../LoginsIcon/LoginsIcon";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import RightChevron from "../RightChevron/RightChevron";

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
            <Flex>
              <LoginsIcon />
              <TextBox>
                <Span>Logins</Span>
                <div>
                  Manage your logins options, including emails, phone numbers
                  and social logins
                </div>
              </TextBox>
              <RightChevron />
            </Flex>
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

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs};
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 50%;
  font-size: 1rem;
`;

const Span = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;
