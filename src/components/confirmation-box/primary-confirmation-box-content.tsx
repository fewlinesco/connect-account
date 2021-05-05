import { Identity } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../buttons/buttons";
import { fetchJson } from "@src/utils/fetch-json";

interface PrimaryConfirmationBoxContentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  id: Identity["id"];
}

const PrimaryConfirmationBoxContent: React.FC<PrimaryConfirmationBoxContentProps> = ({
  setOpen,
  value,
  id,
}) => {
  const router = useRouter();

  return (
    <>
      <PrimaryConfirmationText>
        You are about to set {value} as primary.
      </PrimaryConfirmationText>

      <Button
        type="button"
        variant={ButtonVariant.PRIMARY}
        onClick={async () => {
          fetchJson("/api/identity/mark-identity-as-primary", "POST", {
            identityId: id,
          }).then(() => {
            router && router.push("/account/logins");
          });
        }}
      >
        Confirm
      </Button>

      <Button
        type="button"
        variant={ButtonVariant.SECONDARY}
        onClick={() => {
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
