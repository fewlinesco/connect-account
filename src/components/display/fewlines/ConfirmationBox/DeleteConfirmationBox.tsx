import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { ConfirmationBox } from "./ConfirmationBox";
import { IdentityTypes } from "@lib/@types";
import { DeleteIdentity } from "@src/components/business/DeleteIdentity";

export const DeleteConfirmationBox = (
  deleteConfirmationBoxOpen: boolean,
  preventDeleteAnimation: boolean,
  setDeleteConfirmationBoxOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string,
  type: IdentityTypes,
): JSX.Element => {
  return (
    <ConfirmationBox
      open={deleteConfirmationBoxOpen}
      setOpen={setDeleteConfirmationBoxOpen}
      preventAnimation={preventDeleteAnimation}
    >
      <>
        <DeleteConfirmationText>
          You are about to delete {value}
        </DeleteConfirmationText>
        <DeleteIdentity type={type} value={value}>
          {({ deleteIdentity }) => (
            <Button variant={ButtonVariant.DANGER} onClick={deleteIdentity}>
              Delete this{" "}
              {type === IdentityTypes.PHONE ? "phone number" : "email address"}
            </Button>
          )}
        </DeleteIdentity>
        <Button
          variant={ButtonVariant.SECONDARY}
          onClick={() => setDeleteConfirmationBoxOpen(false)}
        >
          Keep {type === IdentityTypes.PHONE ? "phone number" : "email address"}
        </Button>
      </>
    </ConfirmationBox>
  );
};

export const DeleteConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
`;
