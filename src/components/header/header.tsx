import React from "react";
import styled from "styled-components";

import { Logo } from "../logo/logo";
import { NeutralLink } from "../neutral-link/neutral-link";

const Header: React.FC = () => {
  return (
    <Flex>
      <NeutralLink href="/account">
        <Logo />
      </NeutralLink>
      <p>Account</p>
    </Flex>
  );
};

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => `${theme.spaces.xs} ${theme.spaces.xs}`};

  p {
    display: flex;
    align-items: center;
    height: ${({ theme }) => theme.spaces.s};
    padding-left: ${({ theme }) => theme.spaces.xxs};
    margin-left: ${({ theme }) => theme.spaces.xxs};
    border-left: ${({ theme }) =>
      `${theme.colors.blacks[0]} ${theme.borders.thin}`};
    font-weight: ${({ theme }) => theme.fontWeights.normal};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }
`;

export { Header };
