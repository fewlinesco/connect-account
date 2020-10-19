import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { H2 } from "../H2/H2";
import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import { ShadowBox } from "../ShadowBox/ShadowBox";

type SecurityProps = {
  isPasswordSet: boolean;
};

export const Security: React.FC<SecurityProps> = ({ isPasswordSet }) => {
  return (
    <Container>
      <H1>Security</H1>
      <H2>Password, login history and more</H2>
      <ShadowBox>
        <Link href={`/account/security/${isPasswordSet ? "update" : "set"}`}>
          <NeutralLink>
            <Flex>
              <TextBox>
                {isPasswordSet ? "Update" : "Set"} your password
              </TextBox>
              <RightChevron />
            </Flex>
          </NeutralLink>
        </Link>
      </ShadowBox>
    </Container>
  );
};

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs};
  cursor: pointer;
`;

export const TextBox = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.s};
  line-height: ${({ theme }) => theme.lineHeights.title};
  max-width: 50%;
`;
