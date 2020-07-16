import React from "react";
import styled from "styled-components";

import fewlinesLogo from "../assets/logo-fewlines-2020.png";

export const Header: React.FC = () => {
  return (
    <Flex>
      <img width="130" src={fewlinesLogo} aria-label="Fewlines logo" />
      <H1>Welcome to Connect Account</H1>
    </Flex>
  );
};

const Flex = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) =>
    `${theme.spaces.component.m} ${theme.spaces.component.xxs}`};
`;

const H1 = styled.h1`
  padding-left: ${({ theme }) => theme.spaces.component.xxs};
  margin-left: ${({ theme }) => theme.spaces.component.xxs};
  border-left: ${({ theme }) =>
    `${theme.colors.blacks[3]} ${theme.borders.normal}`};
`;
