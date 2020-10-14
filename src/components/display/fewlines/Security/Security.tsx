import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { H2 } from "../H2/H2";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import RightChevron from "../RightChevron/RightChevron";
import { ShadowBox } from "../ShadowBox/ShadowBox";

type SecurityProps = {
  isPasswordSet: boolean;
};

const Security: React.FC<SecurityProps> = ({ isPasswordSet }) => {
  return (
    <Container>
      <H1>Security</H1>
      <H2>Password, login history and more</H2>
      {isPasswordSet ? (
        <ShadowBox>
          <Content>
            <Link href="/account/logins">
              <NeutralLink>
                <Flex>
                  <TextBox>
                    <div>
                      Manage your logins options, including emails, phone
                      numbers and social logins
                    </div>
                  </TextBox>
                  <RightChevron />
                </Flex>
              </NeutralLink>
            </Link>
          </Content>
        </ShadowBox>
      ) : (
        <div />
      )}
    </Container>
  );
};

export default Security;

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
