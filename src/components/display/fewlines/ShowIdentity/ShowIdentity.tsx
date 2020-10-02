import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { AwaitingValidationBadge } from "../AwaitingValidationBadge/AwaitingValidationBadge";
import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { NavigationBreadcrumbs } from "../NavigationBreadcrumbs/NavigationBreadcrumbs";
import { PrimaryBadge } from "../PrimaryBadge/PrimaryBadge";
import { Identity, ReceivedIdentityTypes } from "@src/@types/Identity";
import { DeleteIdentity } from "@src/components/business/DeleteIdentity";

type ShowIdentityProps = {
  identity: Identity;
};

export const ShowIdentity: React.FC<ShowIdentityProps> = ({ identity }) => {
  const { id, primary, status, type, value } = identity;

  return (
    <Wrapper>
      <h1>Logins</h1>
      <NavigationBreadcrumbs
        breadcrumbs={[
          type === ReceivedIdentityTypes.EMAIL
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
              Update this {type === "phone" ? "phone number" : "email address"}
            </Button>
          </a>
        </Link>
      )}
      {!primary && status === "validated" && (
        <Button variant={ButtonVariant.SECONDARY}>
          Make this my primary {type}
        </Button>
      )}
      {!primary && (
        <DeleteIdentity type={type} value={value}>
          {({ deleteIdentity }) => (
            <Button variant={ButtonVariant.GHOST} onClick={deleteIdentity}>
              Delete this {type === "phone" ? "phone number" : "email address"}
            </Button>
          )}
        </DeleteIdentity>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 90%;
  margin: 0 auto;

  h1 {
    margin: ${({ theme }) => theme.spaces.component.s} 0
      ${({ theme }) => theme.spaces.component.xxs};
  }

  button {
    margin-bottom: ${({ theme }) => theme.spaces.component.xxs};
    width: 100%;
  }
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
