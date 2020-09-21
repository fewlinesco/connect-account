import Link from "next/link";
import React from "react";
import styled from "styled-components";

import type { Identity } from "../@types/Identity";
import { DeleteIdentity } from "../components/business/DeleteIdentity";
import { AwaitingValidationBadge } from "./display/fewlines/AwaitingValidationBadge.tsx/AwaitingValidationBadge";
import { Box } from "./display/fewlines/Box";
import { Button, ButtonVariant } from "./display/fewlines/Button";
import { PrimaryBadge } from "./display/fewlines/PrimaryBadge/PrimaryBadge";

type IdentityLineProps = {
  identity: Identity;
};

export const IdentityLine: React.FC<IdentityLineProps> = ({ identity }) => {
  const { id, primary, status, type, value } = identity;

  return (
    <IdentityBox key={value}>
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
    </IdentityBox>
  );
};

const IdentityBox = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};

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
