import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../@types/HttpVerbs";
import { IdentityTypes } from "../@types/Identity";
import { customFetch } from "../utils/customFetch";

interface FetchIconButtonProps {
  type: IdentityTypes;
  method: HttpVerbs;
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

        customFetch("/api/identity", method, requestData);
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
