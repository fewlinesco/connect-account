import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { ConfirmationBox } from "./ConfirmationBox";
import { Identity } from "@lib/@types";
import { MarkIdentityAsPrimary } from "@src/components/business/MarkIdentityAsPrimary";

export const PrimaryConfirmationBox = (
  primaryConfirmationBoxOpen: boolean,
  preventPrimaryAnimation: boolean,
  setPrimaryConfirmationBoxOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string,
  id: Identity["id"],
): JSX.Element => {
  return (
    <ConfirmationBox
      open={primaryConfirmationBoxOpen}
      setOpen={setPrimaryConfirmationBoxOpen}
      preventAnimation={preventPrimaryAnimation}
    >
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
            setPrimaryConfirmationBoxOpen(false);
          }}
        >
          Cancel
        </Button>
      </>
    </ConfirmationBox>
  );
};

export const PrimaryConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
`;
