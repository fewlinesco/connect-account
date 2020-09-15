import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Identity } from "../@types/Identity";
import { DeleteIdentity } from "../components/business/DeleteIdentity";
import { Button, ButtonVariant } from "./display/fewlines/Button";

type IdentityLineProps = {
  identity: Identity;
};

export const IdentityLine: React.FC<IdentityLineProps> = ({ identity }) => {
  const { id, primary, status, type, value } = identity;

  return (
    <IdentityBox key={value}>
      <Flex>
        <Value>{value}</Value>
      </Flex>
      {status === "unvalidated" && (
        <>
          <p>awaiting validation</p>
          <Link href={`/account/logins/${type}/validation`}>
            <a>
              <Button variant={ButtonVariant.PRIMARY}>
                proceed to validation
              </Button>
            </a>
          </Link>
        </>
      )}
      {primary && status === "validated" && <p>Primary</p>}
      {status === "validated" && (
        <IdentityInfo>
          <p>Added on ...</p>
          <p>Last used to login on ...</p>
        </IdentityInfo>
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
  margin-right: 0.5rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
