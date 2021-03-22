import React from "react";
import styled from "styled-components";

import { LockIcon } from "@src/components/icons/lock-icon/lock-icon";
import { Separator } from "@src/components/separator/separator";

const Sudo: React.FC = () => {
  return (
    <Wrapper>
      <SecurityMessage>
        <LockIcon />
        <p>You need double factor authentication to access this page</p>
      </SecurityMessage>
      <Separator />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: ${({ theme }) => theme.lineHeights.copy};
  background-color: ${({ theme }) => theme.colors.box};
  padding: ${({ theme }) => theme.spaces.s} 6rem;
`;

const SecurityMessage = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.red};
  margin-bottom: ${({ theme }) => theme.spaces.xs};

  svg {
    flex-shrink: 0;
  }

  p {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xs};
  }
`;

export { Sudo };
