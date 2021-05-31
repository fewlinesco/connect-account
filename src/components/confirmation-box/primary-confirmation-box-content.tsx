import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../buttons/buttons";

interface PrimaryConfirmationBoxContentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  onPress: () => void;
}

const PrimaryConfirmationBoxContent: React.FC<PrimaryConfirmationBoxContentProps> =
  ({ setOpen, value, onPress }) => {
    return (
      <>
        <PrimaryConfirmationText>
          You are about to set {value} as primary.
        </PrimaryConfirmationText>

        <Button type="button" variant={ButtonVariant.PRIMARY} onPress={onPress}>
          Confirm
        </Button>

        <Button
          type="button"
          variant={ButtonVariant.SECONDARY}
          onPress={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </>
    );
  };

const PrimaryConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
  line-height: ${({ theme }) => theme.lineHeights.copy};
  text-align: center;
  word-break: break-word;
`;

export { PrimaryConfirmationBoxContent, PrimaryConfirmationText };
