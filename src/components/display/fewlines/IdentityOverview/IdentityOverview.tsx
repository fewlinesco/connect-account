import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { AwaitingValidationBadge } from "../AwaitingValidationBadge/AwaitingValidationBadge";
import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { ConfirmationBox } from "../ConfirmationBox/ConfirmationBox";
import { DeleteConfirmationBoxContent } from "../ConfirmationBox/DeleteConfirmationBoxContent";
import { PrimaryConfirmationBoxContent } from "../ConfirmationBox/PrimaryConfirmationBoxContent";
import { PrimaryBadge } from "../PrimaryBadge/PrimaryBadge";
import { Identity, IdentityTypes } from "@lib/@types";

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
  const [confirmationBoxContent, setConfirmationBoxContent] = React.useState<
    JSX.Element
  >(<React.Fragment />);

  const { primary, status, type, value } = identity;

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
        <Link href={`/account/logins/${type}/validation`}>
          <a>
            <Button variant={ButtonVariant.PRIMARY}>
              proceed to validation
            </Button>
          </a>
        </Link>
      )}
      {/* {status === "validated" && (
        <Link href={`/account/logins/${type}/${id}/update`}>
          <a>
            <Button variant={ButtonVariant.PRIMARY}>
              Update this{" "}
              {type === IdentityTypes.PHONE ? "phone number" : "email address"}
            </Button>
          </a>
        </Link>
      )} */}
      {!primary && status === "validated" && (
        <Button
          variant={ButtonVariant.SECONDARY}
          onClick={() => {
            setPreventAnimation(false);
            setConfirmationBoxContent(
              PrimaryConfirmationBoxContent(setConfirmationBoxOpen, value),
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
          {type === IdentityTypes.PHONE ? "phone number" : "email address"}
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
