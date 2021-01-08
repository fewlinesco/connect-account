import React from "react";
import styled from "styled-components";

import { Box } from "../../../box/box";
import { Button, ButtonVariant } from "../../../button/button";
import { AwaitingValidationBadge } from "../AwaitingValidationBadge/AwaitingValidationBadge";
import { ConfirmationBox } from "../ConfirmationBox/ConfirmationBox";
import { DeleteConfirmationBoxContent } from "../ConfirmationBox/DeleteConfirmationBoxContent";
import { PrimaryConfirmationBoxContent } from "../ConfirmationBox/PrimaryConfirmationBoxContent";
import { FakeButton } from "../FakeButton/FakeButton";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import { PrimaryBadge } from "../PrimaryBadge/PrimaryBadge";
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
