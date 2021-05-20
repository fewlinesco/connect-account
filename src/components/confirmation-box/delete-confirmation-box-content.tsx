import { IdentityTypes } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../buttons/buttons";
import { getIdentityType } from "@src/utils/get-identity-type";

interface DeleteIdentityProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: IdentityTypes;
  value: string;
  onPress: () => void;
}

const DeleteConfirmationBoxContent: React.FC<DeleteIdentityProps> = ({
  setOpen,
  value,
  type,
  onPress,
}) => (
  <>
    <DeleteConfirmationText>
      You are about to delete {value}
    </DeleteConfirmationText>
    <Button type="button" variant={ButtonVariant.DANGER} onClick={onPress}>
      Delete this{" "}
      {getIdentityType(type) === IdentityTypes.PHONE
        ? "phone number"
        : "email address"}
    </Button>
    <Button
      type="button"
      variant={ButtonVariant.SECONDARY}
      onClick={() => setOpen(false)}
    >
      Keep{" "}
      {getIdentityType(type) === IdentityTypes.PHONE
        ? "phone number"
        : "email address"}
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
