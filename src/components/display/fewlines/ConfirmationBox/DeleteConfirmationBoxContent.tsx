import Cookie from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { IdentityTypes } from "@lib/@types";
//import { DeleteIdentity } from "@src/components/business/DeleteIdentity";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import { fetchJson } from "@src/utils/fetchJson";
import { getIdentityType } from "@src/utils/getIdentityType";

interface DeleteIdentityProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  type: IdentityTypes;
  value: string;
}

export const deleteIdentity = async (
  userId: string,
  type: IdentityTypes,
  value: string,
): Promise<void> => {
  const requestData = {
    userId,
    type: getIdentityType(type),
    value,
  };

  const deleteMessage = `${
    getIdentityType(type) === IdentityTypes.EMAIL
      ? "Email address"
      : "Phone number"
  } has been deleted`;

  return fetchJson("/api/delete-identity", HttpVerbs.DELETE, requestData)
    .then(() => {
      Cookie.set("flashMessage", deleteMessage);
    })
    .catch((error: Error) => {
      throw error;
    });
};

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
