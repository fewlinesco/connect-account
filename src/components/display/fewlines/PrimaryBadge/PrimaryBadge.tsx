import React from "react";
import styled from "styled-components";

import { PrimaryIcon } from "../PrimaryIcon/PrimaryIcon";

export const PrimaryBadge: React.FC = () => {
  return (
    <Wrapper>
      <p>Primary</p>
      <PrimaryIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.primaryBadge};
  border-radius: ${({ theme }) => theme.radii[2]};
  height: 2.4rem;
  color: ${({ theme }) => theme.colors.backgroundContrast};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 9.4rem;
  margin-bottom: 1.5rem;

  p {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    margin-right: 0.3rem;
  }
`;
