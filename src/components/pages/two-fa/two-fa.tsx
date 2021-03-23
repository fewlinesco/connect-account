import { Identity } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";

import { TwoFAForm } from "@src/components/forms/two-fa-form";
import { LockIcon } from "@src/components/icons/lock-icon/lock-icon";
import { Separator } from "@src/components/separator/separator";

const TwoFA: React.FC<{ primaryIdentities: Identity[] }> = ({
  primaryIdentities,
}) => {
  return (
    <Wrapper>
      <SecurityMessage>
        <LockIcon />
        <p>You need double factor authentication to access this page</p>
      </SecurityMessage>
      <Separator />
      <TwoFAForm primaryIdentities={primaryIdentities} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  line-height: ${({ theme }) => theme.lineHeights.copy};
  background-color: ${({ theme }) => theme.colors.box};
  padding: ${({ theme }) => theme.spaces.s} 6rem;
  border-radius: ${({ theme }) => theme.radii[0]};
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

export { TwoFA };
