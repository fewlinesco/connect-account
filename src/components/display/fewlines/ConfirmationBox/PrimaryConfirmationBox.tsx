import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { ConfirmationBox } from "./ConfirmationBox";

export const PrimaryConfirmationBox = (
  primaryConfirmationBoxOpen: boolean,
  preventPrimaryAnimation: boolean,
  setPrimaryConfirmationBoxOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string,
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
        <Button variant={ButtonVariant.PRIMARY}>Confirm</Button>
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
