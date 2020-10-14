import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { H2 } from "../H2/H2";
import { LoginsIcon } from "../LoginsIcon/LoginsIcon";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import RightChevron from "../RightChevron/RightChevron";
import { SecurityIcon } from "../SecurityIcon/SecurityIcon";
import { ShadowBox } from "../ShadowBox/ShadowBox";

const Account: React.FC = () => {
  return (
    <Container>
      <H1>Welcome to your account</H1>
      <H2>First name last name</H2>
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
      <ShadowBox>
        <Content>
          <Link href="#">
            <NeutralLink>
              <Flex>
                <SecurityIcon />
                <TextBox>
                  <Span>SECURITY</Span>
                  <div>
                    Set or change your password. You can check your connexions
                    history here
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
