import React from "react";
import { Method } from "src/@types/Method";
import styled from "styled-components";

import { IdentityTypes } from "../@types/Identity";
import { fetchJson } from "../utils/fetchJson";
import { Methods } from "../utils/fetchJson";

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
  return (
    <Button
      color={color}
      onClick={() => {
        const requestData = {
          userId: "f950d3a9-51e0-4f4f-87ea-7407d08f0d8c",
          type: type,
          value: value,
        };

        fetchJson("/api/identity", method, requestData);
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
