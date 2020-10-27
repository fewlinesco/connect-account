import React from "react";
import styled from "styled-components";

import { config } from "@src/config";
import decatLogo from "@src/design-system/theme/assets/logo/decathlon-logo.png";
import fewlinesLogo from "@src/design-system/theme/assets/logo/logo-fewlines-2020.png";

export const Header: React.FC = () => {
  const logo = config.connectTheme === "decathlon" ? decatLogo : fewlinesLogo;

  return (
    <Flex>
      <img width="90" src={logo} aria-label="Fewlines logo" />
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
