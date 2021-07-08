import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../buttons/buttons";

interface DeleteIdentityProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  textContent: { infos: string; confirm: string; cancel: string };
  onPress: () => void;
}

const DeleteConfirmationBoxContent: React.FC<DeleteIdentityProps> = ({
  setOpen,
  textContent,
  onPress,
}) => (
  <>
    <DeleteConfirmationText>{textContent.infos}</DeleteConfirmationText>
    <Button type="button" variant={ButtonVariant.DANGER} onPress={onPress}>
      {textContent.confirm}
    </Button>
    <Button
      type="button"
      variant={ButtonVariant.SECONDARY}
      onPress={() => setOpen(false)}
    >
      {textContent.cancel}
    </Button>
  </>
);
const DeleteConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
  line-height: ${({ theme }) => theme.lineHeights.copy};
  text-align: center;
  word-break: break-word;
`;

export { DeleteConfirmationBoxContent, DeleteConfirmationText };
