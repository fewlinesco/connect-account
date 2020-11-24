import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { IdentityTypes } from "@lib/@types";
import { DeleteIdentity } from "@src/components/business/DeleteIdentity";
import { getIdentityType } from "@src/utils/getIdentityType";

export const DeleteConfirmationBoxContent = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string,
  type: IdentityTypes,
): JSX.Element => {
  return (
    <>
      <DeleteConfirmationText>
        You are about to delete {value}
      </DeleteConfirmationText>
      <DeleteIdentity type={type} value={value}>
        {({ deleteIdentity }) => (
          <Button variant={ButtonVariant.DANGER} onClick={deleteIdentity}>
            Delete this{" "}
            {getIdentityType(type) === IdentityTypes.PHONE
              ? "phone number"
              : "email address"}
          </Button>
        )}
      </DeleteIdentity>
      <Button variant={ButtonVariant.SECONDARY} onClick={() => setOpen(false)}>
        Keep{" "}
        {getIdentityType(type) === IdentityTypes.PHONE
          ? "phone number"
          : "email address"}
      </Button>
    </>
  );
};

export const DeleteConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
`;
