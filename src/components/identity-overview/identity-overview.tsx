import React from "react";
import styled from "styled-components";

import { AwaitingValidationBadge } from "../awaiting-validation-badge/awaiting-validation-badge";
import { Box } from "../box/box";
import { Button, ButtonVariant } from "../button/button";
import { ConfirmationBox } from "../confirmation-box/confirmation-box";
import { DeleteConfirmationBoxContent } from "../confirmation-box/delete-confirmation-box-content";
import { PrimaryConfirmationBoxContent } from "../confirmation-box/primary-confirmation-box-content";
import { PrimaryBadge } from "../display/fewlines/PrimaryBadge/PrimaryBadge";
import { FakeButton } from "../fake-button/fake-button";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Identity, IdentityTypes } from "@lib/@types";
import { getIdentityType } from "@src/utils/get-identity-type";

type IdentityOverviewProps = {
  identity: Identity;
  userId: string;
};

export const IdentityOverview: React.FC<IdentityOverviewProps> = ({
  identity,
  userId,
}) => {
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
