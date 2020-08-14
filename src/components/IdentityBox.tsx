import React from "react";
import { Trash } from "react-feather";
import styled from "styled-components";

import { HttpVerbs } from "../@types/HttpVerbs";
import { IdentityTypes } from "../@types/Identity";
import { EditIcon } from "../design-system/icons/EditIcon";
import { useTheme } from "../design-system/theme/useTheme";
import { FetchIconButton } from "./FetchIconButton";
import { IdentityInputForm } from "./IdentityInputForm";

export const IdentityLine: React.FC = ({ email, sortedIdentities }) => {
  const [editEmail, setEditIdentity] = React.useState<boolean>(false);

  const theme = useTheme();

  return (
    <IdentityBox key={email.value}>
      <Flex>
        {!editEmail && <Value>{email.value}</Value>}
        {editEmail && <IdentityInputForm type={IdentityTypes.EMAIL} />}
        <Button
          onClick={() => setEditIdentity(!editEmail)}
          color={theme.colors.green}
        >
          <EditIcon />
        </Button>
        {sortedIdentities.emailIdentities.length > 1 ? (
          <FetchIconButton
            type={IdentityTypes.EMAIL}
            method={HttpVerbs.DELETE}
            value={email.value}
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
