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
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

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

  const { id, primary, status, type, value } = identity;

  return (
    <Column>
      <First>
        <Box>
          <Flex>
            <Value>{value}</Value>
          </Flex>
          {primary && status === "validated" && <PrimaryBadge />}
          {status === "validated" ? (
            <IdentityInfo>
              <p>Added on ...</p>
              <p>Last used to login on ...</p>
            </IdentityInfo>
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
        {status === "validated" && (
          <Link href={`/account/logins/${type}/${id}/update`}>
            <a>
              <Button variant={ButtonVariant.PRIMARY}>
                Update this{" "}
                {type === IdentityTypes.PHONE
                  ? "phone number"
                  : "email address"}
              </Button>
            </a>
          </Link>
        )}
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
          </>
        )}
      </First>
      <>
        {primaryConfirmationBoxOpen &&
          PrimaryConfirmationBox(
            primaryConfirmationBoxOpen,
            preventPrimaryAnimation,
            setPrimaryConfirmationBoxOpen,
            value,
            type,
          )}
        {deleteConfirmationBoxOpen &&
          DeleteConfirmationBox(
            deleteConfirmationBoxOpen,
            preventDeleteAnimation,
            setDeleteConfirmationBoxOpen,
            value,
            type,
          )}
      </>
    </Column>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 11rem);

  @media ${deviceBreakpoints.m} {
    height: auto;
  }
`;

const First = styled.div`
  display: block;
`;

const IdentityInfo = styled.div`
  p {
    font-size: ${({ theme }) => theme.fontSizes.s};
    margin-bottom: 0.5rem;
  }
`;

const Value = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0 0 ${({ theme }) => theme.spaces.xxs} 0;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
