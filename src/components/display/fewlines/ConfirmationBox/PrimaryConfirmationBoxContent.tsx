import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../../../button/button";
import { Identity } from "@lib/@types";
import { markIdentityAsPrimaryCall } from "@src/workflows/mark-identity-as-primary";

interface PrimaryConfirmationBoxContentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  id: Identity["id"];
}

export const PrimaryConfirmationBoxContent: React.FC<PrimaryConfirmationBoxContentProps> = ({
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
        variant={ButtonVariant.PRIMARY}
        onClick={async () =>
          await markIdentityAsPrimaryCall(id).then(() => {
            router && router.push("/account/logins");
          })
        }
      >
        Confirm
      </Button>

      <Button
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

export const PrimaryConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.xs};
`;
