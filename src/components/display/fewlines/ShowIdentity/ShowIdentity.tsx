import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { AwaitingValidationBadge } from "../AwaitingValidationBadge/AwaitingValidationBadge";
import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { ClickAwayListener } from "../ConfirmationBox/ClickAwayListener";
import { ConfirmationBox } from "../ConfirmationBox/ConfirmationBox";
import { Container } from "../Container";
import { NavigationBreadcrumbs } from "../NavigationBreadcrumbs/NavigationBreadcrumbs";
import { PrimaryBadge } from "../PrimaryBadge/PrimaryBadge";
import { Identity, IdentityTypes } from "@lib/@types";
import { DeleteIdentity } from "@src/components/business/DeleteIdentity";

type ShowIdentityProps = {
  identity: Identity;
};

export const ShowIdentity: React.FC<ShowIdentityProps> = ({ identity }) => {
  const [
    deleteConfirmationBoxOpen,
    setDeleteConfirmationBoxOpen,
  ] = React.useState<boolean>(false);
  const [
    primaryConfirmationBoxOpen,
    setPrimaryConfirmationBoxOpen,
  ] = React.useState<boolean>(false);
  const { id, primary, status, type, value } = identity;

  return (
    <Container>
      <H1>Logins</H1>
      <NavigationBreadcrumbs
        breadcrumbs={[
          type.toUpperCase() === IdentityTypes.EMAIL
            ? "Email address"
            : "Phone number",
        ]}
      />
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
              {type === IdentityTypes.PHONE ? "phone number" : "email address"}
            </Button>
          </a>
        </Link>
      )}
      {!primary && status === "validated" && (
        <>
          <Button
            variant={ButtonVariant.SECONDARY}
            onClick={() => setPrimaryConfirmationBoxOpen(true)}
          >
            Make this my primary {type.toLowerCase()}
          </Button>
          {primaryConfirmationBoxOpen && (
            <ClickAwayListener
              onClick={() => setPrimaryConfirmationBoxOpen(false)}
            />
          )}
          <ConfirmationBox open={primaryConfirmationBoxOpen}>
            <ConfirmationText>
              You are about to replace mail@mail.com as your main address
            </ConfirmationText>
            <Button variant={ButtonVariant.PRIMARY}>
              Set {value} as my main
            </Button>
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={() => setPrimaryConfirmationBoxOpen(false)}
            >
              Keep mail@mail.co as my primary {type.toLowerCase()}
            </Button>
          </ConfirmationBox>
        </>
      )}
      {!primary && (
        <>
          <Button
            variant={ButtonVariant.GHOST}
            onClick={() =>
              setDeleteConfirmationBoxOpen(!deleteConfirmationBoxOpen)
            }
          >
            Delete this{" "}
            {type === IdentityTypes.PHONE ? "phone number" : "email address"}
          </Button>
          {deleteConfirmationBoxOpen && (
            <ClickAwayListener
              onClick={() => setDeleteConfirmationBoxOpen(false)}
            />
          )}
          <ConfirmationBox open={deleteConfirmationBoxOpen}>
            <ConfirmationText>You are about to delete {value}</ConfirmationText>
            <DeleteIdentity type={type} value={value}>
              {({ deleteIdentity }) => (
                <Button variant={ButtonVariant.DANGER} onClick={deleteIdentity}>
                  Delete this{" "}
                  {type === IdentityTypes.PHONE
                    ? "phone number"
                    : "email address"}
                </Button>
              )}
            </DeleteIdentity>
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={() => setDeleteConfirmationBoxOpen(false)}
            >
              Keep{" "}
              {type === IdentityTypes.PHONE ? "phone number" : "email address"}
            </Button>
          </ConfirmationBox>
        </>
      )}
    </Container>
  );
};

const H1 = styled.h1`
  margin: ${({ theme }) => theme.spaces.component.s} 0
    ${({ theme }) => theme.spaces.component.xxs};
`;

const IdentityInfo = styled.div`
  p {
    font-size: ${({ theme }) => theme.fontSizes.s};
    margin-bottom: 0.5rem;
  }
`;

const Value = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0 0 ${({ theme }) => theme.spaces.component.xxs} 0;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const ConfirmationText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spaces.component.xs};
`;
