import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { LoginsIcon } from "../LoginsIcon/LoginsIcon";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import RightChevron from "../RightChevron/RightChevron";
import { ShadowBox } from "../ShadowBox/ShadowBox";

const Account: React.FC = () => {
  return (
    <Container>
      <Head>
        <title>Connect Account</title>
      </Head>
      <H1>Welcome to your account</H1>
      <SubTitle>First name last name</SubTitle>
      <ShadowBox>
        <Content>
          <Link href="/account/logins">
            <NeutralLink>
              <Flex>
                <LoginsIcon />
                <TextBox>
                  <Span>LOGINS</Span>
                  <div>
                    Manage your logins options, including emails, phone numbers
                    and social logins
                  </div>
                </TextBox>
                <RightChevron />
              </Flex>
            </NeutralLink>
          </Link>
        </Content>
      </ShadowBox>
    </Container>
  );
};

export default Account;

export const SubTitle = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: ${({ theme }) => theme.fontSizes.s};
  margin: 0 0 ${({ theme }) => theme.spaces.s} 0;
`;

const Content = styled.div`
  cursor: pointer;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs};
`;

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  line-height: ${({ theme }) => theme.lineHeights.title};
`;

export const Span = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s};
`;
