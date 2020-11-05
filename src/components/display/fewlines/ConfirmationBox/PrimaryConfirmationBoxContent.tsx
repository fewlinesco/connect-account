import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { Identity } from "@lib/@types";
import { MarkIdentityAsPrimary } from "@src/components/business/MarkIdentityAsPrimary";

export const PrimaryConfirmationBoxContent = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string,
  id: Identity["id"],
): JSX.Element => {
  return (
    <>
      <PrimaryConfirmationText>
        You are about to set {value} as primary.
      </PrimaryConfirmationText>
      <MarkIdentityAsPrimary identityId={id}>
        {({ markIdentityAsPrimaryCall }) => (
          <Button
            variant={ButtonVariant.PRIMARY}
            onClick={markIdentityAsPrimaryCall}
          >
            Confirm
          </Button>
        )}
      </MarkIdentityAsPrimary>
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => {
          setOpen(false);
        }}
      >
        Cancel
      </Button>
    </>
  );
};

export const PrimaryConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
`;
