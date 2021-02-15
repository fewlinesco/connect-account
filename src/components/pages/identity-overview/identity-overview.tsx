import { Identity, IdentityTypes } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";

import {
  AwaitingValidationBadge,
  PrimaryBadge,
} from "@src/components/badges/badges";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { ConfirmationBox } from "@src/components/confirmation-box/confirmation-box";
import { DeleteConfirmationBoxContent } from "@src/components/confirmation-box/delete-confirmation-box-content";
import { PrimaryConfirmationBoxContent } from "@src/components/confirmation-box/primary-confirmation-box-content";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { getIdentityType } from "@src/utils/get-identity-type";

const IdentityOverview: React.FC<{
  identity: Identity;
  userId: string;
}> = ({ identity, userId }) => {
  const [confirmationBoxOpen, setConfirmationBoxOpen] = React.useState<boolean>(
    false,
  );
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);
  const [
    confirmationBoxContent,
    setConfirmationBoxContent,
  ] = React.useState<JSX.Element>(<React.Fragment />);

  const { id, primary, status, type, value } = identity;

  return (
    <>
      <Box>
        <Flex>
          <Value>{value}</Value>
        </Flex>
        {primary && status === "validated" && <PrimaryBadge />}
        {status === "validated" ? (
          <React.Fragment />
        ) : (
          <AwaitingValidationBadge />
        )}
      </Box>
      {status === "unvalidated" && (
        <NeutralLink href={`/account/logins/${type}/validation`}>
          <FakeButton variant={ButtonVariant.PRIMARY}>
            Proceed to validation
          </FakeButton>
        </NeutralLink>
      )}
      {/* {status === "validated" && (
        <NeutralLink href={`/account/logins/${type}/${identity.id}/update`}>
          <FakeButton variant={ButtonVariant.PRIMARY}>
            Update this{" "}
            {getIdentityType(type) === IdentityTypes.PHONE
              ? "phone number"
              : "email address"}
          </FakeButton>
        </NeutralLink>
      )} */}
      {!primary && status === "validated" && (
        <Button
          variant={ButtonVariant.SECONDARY}
          onClick={() => {
            setPreventAnimation(false);
            setConfirmationBoxContent(
              <PrimaryConfirmationBoxContent
                setOpen={setConfirmationBoxOpen}
                value={value}
                id={id}
              />,
            );
            setConfirmationBoxOpen(true);
          }}
        >
          Make {value} my primary {type.toLowerCase()}
        </Button>
      )}
      {!primary && (
        <Button
          variant={ButtonVariant.GHOST}
          onClick={() => {
            setPreventAnimation(false);
            setConfirmationBoxContent(
              <DeleteConfirmationBoxContent
                setOpen={setConfirmationBoxOpen}
                value={value}
                type={type}
                userId={userId}
              />,
            );
            setConfirmationBoxOpen(true);
          }}
        >
          Delete this{" "}
          {getIdentityType(type) === IdentityTypes.PHONE
            ? "phone number"
            : "email address"}
        </Button>
      )}
      <ConfirmationBox
        open={confirmationBoxOpen}
        setOpen={setConfirmationBoxOpen}
        preventAnimation={preventAnimation}
      >
        {confirmationBoxContent}
      </ConfirmationBox>
    </>
  );
};

const Value = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: ${({ theme }) => theme.spaces.xs} 0;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export { IdentityOverview };
