import { Identity } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";

import { SendTwoFACodeForm } from "@src/components/forms/send-two-fa-code-form";
import { VerifyTwoFACodeForm } from "@src/components/forms/verify-two-fa-code-form";
import { LockIcon } from "@src/components/icons/lock-icon/lock-icon";
import { Separator } from "@src/components/separator/separator";

const TwoFA: React.FC<{ primaryIdentities: Identity[] }> = ({
  primaryIdentities,
}) => {
  const [isCodeSent, setIsCodeSent] = React.useState<boolean>(false);

  return (
    <Wrapper>
      <SecurityMessage>
        <LockIcon />
        <p>You need double factor authentication to access this page</p>
      </SecurityMessage>
      <Separator />
      <SendTwoFACodeForm
        primaryIdentities={primaryIdentities}
        isCodeSent={isCodeSent}
        setIsCodeSent={setIsCodeSent}
      />
      {isCodeSent ? (
        <>
          <Separator />
          <VerifyTwoFACodeForm setIsCodeSent={setIsCodeSent} />
        </>
      ) : null}
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
