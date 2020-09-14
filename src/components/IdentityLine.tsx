import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { ButtonVariant } from "../@types/ButtonVariant";
import {
  IdentityTypes,
  Identity,
  ReceivedIdentityTypes,
} from "../@types/Identity";
import { DeleteIdentity } from "../components/business/DeleteIdentity";
import { DeleteButton } from "../components/display/fewlines/DeleteButton";
import { Button } from "./display/fewlines/Button";

type IdentityLineProps = {
  identity: Identity;
};

export const IdentityLine: React.FC<IdentityLineProps> = ({ identity }) => {
  const { value, type, primary } = identity;
  const { EMAIL } = ReceivedIdentityTypes;

  return (
    <IdentityBox key={value}>
      <Flex>
        <Value>{value}</Value>
        {!primary && (
          <DeleteIdentity
            type={type === EMAIL ? IdentityTypes.EMAIL : IdentityTypes.PHONE}
            value={value}
          >
            {({ deleteIdentity }) => (
              <DeleteButton deleteIdentity={deleteIdentity} />
            )}
          </DeleteIdentity>
        )}
      </Flex>
      {identity.status === "unvalidated" && (
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
      {identity.primary && identity.status === "validated" && <p>Primary</p>}
      {identity.status === "validated" && (
        <IdentityInfo>
          <p>Added on ...</p>
          <p>Last used to login on ...</p>
        </IdentityInfo>
      )}
      {identity.status === "validated" && (
        <Link href={`/account/logins/${identity.type}/${identity.id}/update`}>
          <a>
            <Button variant={ButtonVariant.PRIMARY}>
              Update this{" "}
              {identity.type === "phone" ? "phone number" : "email address"}
            </Button>
          </a>
        </Link>
      )}
      {!identity.primary && identity.status === "validated" && (
        <Button variant={ButtonVariant.SECONDARY}>
          Make this my primary {identity.type}
        </Button>
      )}
    </IdentityBox>
  );
};

const IdentityBox = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};

  button {
    margin-bottom: ${({ theme }) => theme.spaces.component.xs};
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
