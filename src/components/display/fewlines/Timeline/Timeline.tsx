import React from "react";
import styled from "styled-components";

export const Timeline: React.FC = () => {
  return <Content />;
};

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% + ${({ theme }) => theme.spaces.s});
  border-left: 1px solid ${({ theme }) => theme.colors.separator};
`;
