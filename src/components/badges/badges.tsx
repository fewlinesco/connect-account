import React from "react";
import styled from "styled-components";

import { AwaitingValidationIcon } from "../icons/awaiting-validation-icon/awaiting-validation-icon";
import { PrimaryIcon } from "../icons/primary-icon/primary-icon";

const PrimaryBadge: React.FC = () => {
  return (
    <Wrapper>
      <BadgeLabel>Primary</BadgeLabel>
      <PrimaryIcon />
    </Wrapper>
  );
};

const AwaitingValidationBadge: React.FC = () => {
  return (
    <AwaitingWrapper>
      <BadgeLabel>Awaiting validation</BadgeLabel>
      <AwaitingValidationIcon />
    </AwaitingWrapper>
  );
};

const AwaitingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.red};
  border-radius: ${({ theme }) => theme.radii[2]};
  height: 2.4rem;
  color: ${({ theme }) => theme.colors.background};
  width: 15.8rem;
  margin-bottom: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii[2]};
  height: 2.4rem;
  color: ${({ theme }) => theme.colors.background};
  width: 9.4rem;
`;

const BadgeLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-right: 0.3rem;
`;

export { PrimaryBadge, AwaitingValidationBadge };
