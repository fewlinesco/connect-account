import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { AwaitingValidationBadge } from "./display/fewlines/AwaitingValidationBadge/AwaitingValidationBadge";
import { Box } from "./display/fewlines/Box/Box";
import { Button, ButtonVariant } from "./display/fewlines/Button/Button";
import { NavigationBreadcrumbs } from "./display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { PrimaryBadge } from "./display/fewlines/PrimaryBadge/PrimaryBadge";
import type { Identity } from "@src/@types/Identity";
import { DeleteIdentity } from "@src/components/business/DeleteIdentity";

type IdentityLineProps = {
  identity: Identity;
};

export const IdentityLine: React.FC<IdentityLineProps> = ({ identity }) => {
  const { id, primary, status, type, value } = identity;

  return (
    <Wrapper>
      <NavigationBreadcrumbs title="Logins" />
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
