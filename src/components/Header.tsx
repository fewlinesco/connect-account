import React from "react";
import styled from "styled-components";

import fewlinesLogo from "../assets/logo-fewlines-2020.png";

export const Header: React.FC = () => {
  return (
    <Flex>
      <img width="90" src={fewlinesLogo} aria-label="Fewlines logo" />
      <H5>Account</H5>
    </Flex>
  );
};

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) =>
    `${theme.spaces.component.xs} ${theme.spaces.component.xs}`};
`;

const H5 = styled.h5`
  padding-left: ${({ theme }) => theme.spaces.component.xxs};
  margin-left: ${({ theme }) => theme.spaces.component.xxs};
  border-left: ${({ theme }) =>
    `${theme.colors.blacks[0]} ${theme.borders.thin}`};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-size: ${({ theme }) => theme.fontSizes.s};
  display: flex;
  align-items: center;
  height: ${({ theme }) => theme.spaces.component.s}; ;
`;
