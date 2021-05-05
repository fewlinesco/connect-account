import { IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../buttons/buttons";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

interface DeleteIdentityProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: IdentityTypes;
  value: string;
}

const DeleteConfirmationBoxContent: React.FC<DeleteIdentityProps> = ({
  setOpen,
  value,
  type,
}) => {
  const router = useRouter();

  return (
    <>
      <DeleteConfirmationText>
        You are about to delete {value}
      </DeleteConfirmationText>
      <Button
        type="button"
        variant={ButtonVariant.DANGER}
        onClick={async () => {
          const requestData = {
            type: getIdentityType(type),
            value,
          };

          await fetchJson(
            "/api/identity/delete-identity",
            "DELETE",
            requestData,
          ).then(() => {
            router && router.push("/account/logins");
          });
        }}
      >
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
};

const DeleteConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
  line-height: ${({ theme }) => theme.lineHeights.copy};
  text-align: center;
  word-break: break-word;
`;

export { DeleteConfirmationBoxContent, DeleteConfirmationText };
