import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";

export const PrimaryConfirmationBoxContent = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string,
): JSX.Element => {
  return (
    <>
      <PrimaryConfirmationText>
        You are about to set {value} as primary.
      </PrimaryConfirmationText>
      <Button variant={ButtonVariant.PRIMARY}>Confirm</Button>
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
