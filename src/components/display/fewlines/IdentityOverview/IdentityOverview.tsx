import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { AwaitingValidationBadge } from "../AwaitingValidationBadge/AwaitingValidationBadge";
import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { DeleteConfirmationBox } from "../ConfirmationBox/DeleteConfirmationBox";
import { PrimaryConfirmationBox } from "../ConfirmationBox/PrimaryConfirmationBox";
import { PrimaryBadge } from "../PrimaryBadge/PrimaryBadge";
import { Identity, IdentityTypes } from "@lib/@types";

type IdentityOverviewProps = {
  identity: Identity;
};

export const IdentityOverview: React.FC<IdentityOverviewProps> = ({
  identity,
}) => {
  const [
    deleteConfirmationBoxOpen,
    setDeleteConfirmationBoxOpen,
  ] = React.useState<boolean>(false);

  const [
    primaryConfirmationBoxOpen,
    setPrimaryConfirmationBoxOpen,
  ] = React.useState<boolean>(false);

  const [preventPrimaryAnimation, setPreventPrimaryAnimation] = React.useState<
    boolean
  >(true);

  const [preventDeleteAnimation, setPreventDeleteAnimation] = React.useState<
    boolean
  >(true);

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
        <>
          <Button
            variant={ButtonVariant.SECONDARY}
            onClick={() => {
              setPreventPrimaryAnimation(false);
              setPrimaryConfirmationBoxOpen(true);
            }}
          >
            Make this my primary {type.toLowerCase()}
          </Button>
          {PrimaryConfirmationBox(
            primaryConfirmationBoxOpen,
            preventPrimaryAnimation,
            setPrimaryConfirmationBoxOpen,
            value,
            type,
          )}
        </>
      )}
      {!primary && (
        <>
          <Button
            variant={ButtonVariant.GHOST}
            onClick={() => {
              setPreventDeleteAnimation(false);
              setDeleteConfirmationBoxOpen(!deleteConfirmationBoxOpen);
            }}
          >
            Delete this{" "}
            {type === IdentityTypes.PHONE ? "phone number" : "email address"}
          </Button>
          {DeleteConfirmationBox(
            deleteConfirmationBoxOpen,
            preventDeleteAnimation,
            setDeleteConfirmationBoxOpen,
            value,
            type,
          )}
        </>
      )}
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
