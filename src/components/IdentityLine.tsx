import React from "react";
import { SortedIdentities } from "src/@types/SortedIdentities";
import styled from "styled-components";

import {
  IdentityTypes,
  Identity,
  ReceivedIdentityTypes,
} from "../@types/Identity";
import { DeleteIdentity } from "../components/business/DeleteIdentity";
import { DeleteButton } from "../components/visualization/fewlines/DeleteButton";
import { CancelButton } from "../design-system/icons/CancelButton";
import { EditIcon } from "../design-system/icons/EditIcon";
import { useTheme } from "../design-system/theme/useTheme";
import { UpdateInput } from "./UpdateInput";

type IdentityLineProps = {
  identity: Identity;
  sortedIdentities: SortedIdentities;
};

export const IdentityLine: React.FC<IdentityLineProps> = ({
  identity,
  sortedIdentities,
}) => {
  const [editEmail, setEditIdentity] = React.useState<boolean>(false);

  const theme = useTheme();

  const { value, type } = identity;
  const { EMAIL, PHONE } = ReceivedIdentityTypes;
  const { emailIdentities, phoneIdentities } = sortedIdentities;

  return (
    <IdentityBox key={value}>
      <Flex>
        <Value>{value}</Value>
        <Button
          onClick={() => setEditIdentity(!editEmail)}
          color={theme.colors.green}
        >
          {editEmail ? <CancelButton /> : <EditIcon />}
        </Button>
        {(type === EMAIL && emailIdentities.length > 1) ||
        (type === PHONE && phoneIdentities.length > 1) ? (
          <DeleteIdentity
            type={type === EMAIL ? IdentityTypes.EMAIL : IdentityTypes.PHONE}
            value={value}
          >
            {({ deleteIdentity }) => (
              <DeleteButton deleteIdentity={deleteIdentity} />
            )}
          </DeleteIdentity>
        ) : null}
      </Flex>
      {editEmail && <UpdateInput prop={identity} />}
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

type ButtonProps = {
  color: string;
};

const Button = styled.button<ButtonProps>`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  ${(props) => `color: ${props.color}`};
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  &:hover {
    cursor: pointer;
    ${(props) => `background-color: ${props.color}`};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
  &:active,
  &:focus {
    outline: none;
    ${(props) => `background-color: ${props.color}`};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
`;
