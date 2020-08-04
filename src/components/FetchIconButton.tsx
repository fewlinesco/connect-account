import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../@types/HttpVerbs";
import { IdentityTypes } from "../@types/Identity";

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
          userId: "4fa0974f-43cf-48d9-8649-18190146ffaa",
          type: type,
          value: value,
        };

        fetch("/api/identity", {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
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
