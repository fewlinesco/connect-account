import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../buttons/buttons";

interface PrimaryConfirmationBoxContentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  textContent: { infos: string; confirm: string; cancel: string };
  onPress: () => void;
}

const PrimaryConfirmationBoxContent: React.FC<PrimaryConfirmationBoxContentProps> =
  ({ setOpen, textContent, onPress }) => {
    return (
      <>
        <PrimaryConfirmationText>{textContent.infos}</PrimaryConfirmationText>
        <Button type="button" variant={ButtonVariant.PRIMARY} onPress={onPress}>
          {textContent.confirm}
        </Button>
        <Button
          type="button"
          variant={ButtonVariant.SECONDARY}
          onPress={() => {
            setOpen(false);
          }}
        >
          {textContent.cancel}
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
