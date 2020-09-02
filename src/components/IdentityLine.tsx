import Link from "next/link";
import React from "react";
import styled, { useTheme } from "styled-components";

import {
  IdentityTypes,
  Identity,
  ReceivedIdentityTypes,
} from "../@types/Identity";
import { DeleteIdentity } from "../components/business/DeleteIdentity";
import { DeleteButton } from "../components/display/fewlines/DeleteButton";
import { EditIcon } from "../design-system/icons/EditIcon";

type IdentityLineProps = {
  identity: Identity;
};

export const IdentityLine: React.FC<IdentityLineProps> = ({ identity }) => {
  const { value, type, primary } = identity;
  const { EMAIL } = ReceivedIdentityTypes;

  const theme = useTheme();

  return (
    <IdentityBox key={value}>
      <Flex>
        <Value>{value}</Value>
        <Link href={`/account/logins/${identity.type}/${identity.id}/update`}>
          <a>
            <EditIcon />
          </a>
        </Link>
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
          <p>awaiting validation</p> <Button>proceed to validation</Button>
        </>
      )}
      {identity.primary && identity.status === "validated" && <p>Primary</p>}
      {identity.status === "validated" && (
        <>
          <br />
          <small>Added on ...</small>
          <br />
          <small>Last used to login on ...</small>
        </>
      )}
      {!identity.primary && identity.status === "validated" && (
        <Button>Make this my primary {identity.type}</Button>
      )}
    </IdentityBox>
  );
};

const IdentityBox = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs};
`;

const Value = styled.p`
  margin-right: 0.5rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const Button = styled.button`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.green};
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.green}};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
  &:active,
  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.green}};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
`;
