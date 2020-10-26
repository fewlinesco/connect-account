import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { ClickAwayListener } from "../ClickAwayListener";
import { ConfirmationBox } from "./ConfirmationBox";
import { IdentityTypes } from "@lib/@types";

export const PrimaryConfirmationBox = (
  primaryConfirmationBoxOpen: boolean,
  preventPrimaryAnimation: boolean,
  setPrimaryConfirmationBoxOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string,
  type: IdentityTypes,
): JSX.Element => {
  return (
    <>
      {primaryConfirmationBoxOpen && (
        <ClickAwayListener
          onClick={() => {
            setPrimaryConfirmationBoxOpen(false);
          }}
        />
      )}
      <ConfirmationBox
        open={primaryConfirmationBoxOpen}
        preventAnimation={preventPrimaryAnimation}
      >
        <>
          <PrimaryConfirmationText>
            You are about to replace mail@mail.com as your main address
          </PrimaryConfirmationText>
          <Button variant={ButtonVariant.PRIMARY}>
            Set {value} as my main
          </Button>
          <Button
            variant={ButtonVariant.SECONDARY}
            onClick={() => {
              setPrimaryConfirmationBoxOpen(false);
            }}
          >
            Keep mail@mail.co as my primary {type.toLowerCase()}
          </Button>
        </>
      </ConfirmationBox>
    </>
  );
};

export const PrimaryConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
`;
