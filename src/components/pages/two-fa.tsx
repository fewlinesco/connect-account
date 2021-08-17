import { Identity } from "@fewlines/connect-management";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import useSWR from "swr";

import { SendTwoFACodeForm } from "@src/components/forms/send-two-fa-code-form";
import { VerifyTwoFACodeForm } from "@src/components/forms/verify-two-fa-code-form";
import { LockIcon } from "@src/components/icons/lock-icon";
import { Separator } from "@src/components/separator";
import { deviceBreakpoints } from "@src/design-system/theme";

const TwoFA: React.FC = () => {
  const [isCodeSent, setIsCodeSent] = React.useState<boolean>(false);

  const { data: primaryIdentities, error } = useSWR<Identity[], Error>(
    "/api/identities?primary=true/",
  );

  if (error) {
    throw error;
  }

  const { formatMessage } = useIntl();

  return (
    <Wrapper>
      <SecurityMessage>
        <LockIcon />
        <p>{formatMessage({ id: "warning" })}</p>
      </SecurityMessage>
      <Separator />
      <SendTwoFACodeForm
        isCodeSent={isCodeSent}
        setIsCodeSent={setIsCodeSent}
        identities={primaryIdentities}
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

  @media ${deviceBreakpoints.m} {
    padding: 3rem ${({ theme }) => theme.spaces.xs};
  }
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

  @media ${deviceBreakpoints.m} {
    p {
      line-height: 2.2rem;
    }
  }
`;

export { TwoFA };
