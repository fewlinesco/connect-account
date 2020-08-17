import React from "react";
import { Trash } from "react-feather";
import { SortedIdentities } from "src/@types/SortedIdentities";
import styled from "styled-components";

import { HttpVerbs } from "../@types/HttpVerbs";
import { IdentityTypes, Identity } from "../@types/Identity";
import { EditIcon } from "../design-system/icons/EditIcon";
import { useTheme } from "../design-system/theme/useTheme";
import { FetchIconButton } from "./FetchIconButton";
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

  return (
    <IdentityBox key={identity.value}>
      <Flex>
        {!editEmail && <Value>{identity.value}</Value>}
        {editEmail && <UpdateInput prop={identity} />}
        <Button
          onClick={() => setEditIdentity(!editEmail)}
          color={theme.colors.green}
        >
          <EditIcon />
        </Button>
        {sortedIdentities.emailIdentities.length > 1 ? (
          <FetchIconButton
            type={
              identity.type === "email"
                ? IdentityTypes.EMAIL
                : IdentityTypes.PHONE
            }
            method={HttpVerbs.DELETE}
            value={identity.value}
            color={theme.colors.red}
          >
            <Trash width="15" />
          </FetchIconButton>
        ) : null}
      </Flex>
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
