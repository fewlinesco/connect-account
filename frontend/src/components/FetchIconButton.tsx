import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../@types/HttpVerbs";
import { IdentityTypes } from "../@types/Identities";

interface FetchIconButtonProps {
  endpoint: string;
  type: IdentityTypes;
  method: HttpVerbs;
  value: string;
  color: string;
}

export const FetchIconButton: React.FC<FetchIconButtonProps> = ({
  endpoint,
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
        console.log(endpoint);
        const requestData = {
          userId: "5b5fe222-3070-4169-8f24-51b587b2dbc5",
          type: type,
          value: value,
        };

        fetch(endpoint, {
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

type ButtonProps = {
  color: string;
};

const Button = styled.button<ButtonProps>`
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
