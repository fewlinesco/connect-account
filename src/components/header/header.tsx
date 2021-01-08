import React from "react";
import styled from "styled-components";

import { NeutralLink } from "../display/fewlines/neutral-link/neutral-link";
import { useTheme } from "@src/design-system/theme/use-theme";

export const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <Flex>
      <NeutralLink href="/account">
        <img width="90" src={theme.logo} aria-label="Logo" />
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
