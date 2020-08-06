import React from "react";
import { Method } from "src/@types/Method";
import styled from "styled-components";

import { IdentityTypes } from "../@types/Identity";
import { useCookies } from "../hooks/useCookies";
import { fetchJson } from "../utils/fetchJson";

interface FetchIconButtonProps {
  type: IdentityTypes;
  method: Method;
  value: string;
  color: string;
}

export const FetchIconButton: React.FC<FetchIconButtonProps> = ({
  type,
  method,
  value,
  color,
  children,
}) => {
  const { data, error } = useCookies();

  if (error) return <div>failed to load</div>;
  if (!data) return <React.Fragment />;

  return (
    <Button
      color={color}
      onClick={() => {
        const requestData = {
          userId: data.userId,
          type: type,
          value: value,
        };

        fetchJson("/api/account", method, requestData);
      }}
    >
      {children}
    </Button>
  );
};

const Button = styled.button<{ color: string }>`
  padding: 0.5rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  ${(props) => `color: ${props.color}`};
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    cursor: pointer;
  }

  &:active {
    outline: none;
  }
`;
