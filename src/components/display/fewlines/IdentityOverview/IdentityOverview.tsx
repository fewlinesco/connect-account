import React from "react";
import styled from "styled-components";

import { AwaitingValidationBadge } from "../AwaitingValidationBadge/AwaitingValidationBadge";
import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { ConfirmationBox } from "../ConfirmationBox/ConfirmationBox";
import { DeleteConfirmationBoxContent } from "../ConfirmationBox/DeleteConfirmationBoxContent";
import { PrimaryConfirmationBoxContent } from "../ConfirmationBox/PrimaryConfirmationBoxContent";
import { NeutralLink } from "../NeutralLink";
import { PrimaryBadge } from "../PrimaryBadge/PrimaryBadge";
import { Identity, IdentityTypes } from "@lib/@types";
import { getIdentityType } from "@src/utils/getIdentityType";

type IdentityOverviewProps = {
  identity: Identity;
};

export const IdentityOverview: React.FC<IdentityOverviewProps> = ({
  identity,
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
        <NeutralLink href={`/account/logins/${type}/validation`} tabIndex={-1}>
          <Button variant={ButtonVariant.PRIMARY}>proceed to validation</Button>
        </NeutralLink>
      )}
      {/* {status === "validated" && (
        <NeutralLink href={`/account/logins/${type}/${id}/update`}>
            <Button variant={ButtonVariant.PRIMARY}>
              Update this{" "}
              {type === IdentityTypes.PHONE ? "phone number" : "email address"}
            </Button>
        </NeutralLink>
      )} */}
      {!primary && status === "validated" && (
        <Button
          variant={ButtonVariant.SECONDARY}
          onClick={() => {
            setPreventAnimation(false);
            setConfirmationBoxContent(
              PrimaryConfirmationBoxContent(setConfirmationBoxOpen, value, id),
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
              DeleteConfirmationBoxContent(setConfirmationBoxOpen, value, type),
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
