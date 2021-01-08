import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../button/button";
import { IdentityTypes } from "@lib/@types";
import { getIdentityType } from "@src/utils/get-identity-type";
import { deleteIdentity } from "@src/workflows/delete-identity";

interface DeleteIdentityProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  type: IdentityTypes;
  value: string;
}

export const DeleteConfirmationBoxContent: React.FC<DeleteIdentityProps> = ({
  setOpen,
  value,
  type,
  userId,
}) => {
  const router = useRouter();

  return (
    <>
      <DeleteConfirmationText>
        You are about to delete {value}
      </DeleteConfirmationText>
      <Button
        variant={ButtonVariant.DANGER}
        onClick={async () =>
          await deleteIdentity(userId, type, value).then(() => {
            router && router.push("/account/logins");
          })
        }
      >
        Delete this{" "}
        {getIdentityType(type) === IdentityTypes.PHONE
          ? "phone number"
          : "email address"}
      </Button>
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
