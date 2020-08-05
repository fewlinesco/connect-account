import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../@types/HttpVerbs";
import { IdentityTypes } from "../@types/Identity";
import { fetchJson } from "../utils/fetchJson";

export const IdentityInputForm: React.FC<{ type: IdentityTypes }> = ({
  type,
}) => {
  const [identity, setIdentity] = React.useState("");

  return (
    <Form
      data-testid="identity-form"
      method="post"
      onSubmit={() => {
        const body = {
          userId: "f950d3a9-51e0-4f4f-87ea-7407d08f0d8c",
          type,
          value: identity,
        };

        fetchJson("/api/identity", HttpVerbs.POST, body);
      }}
    >
      <Input
        type="text"
        name="value"
        placeholder="Enter your email"
        value={identity}
        onChange={(event) => setIdentity(event.target.value)}
      />
      <SendInput type="submit" value="Send" />
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  border: ${({ theme }) => `${theme.colors.blacks[0]} ${theme.borders.thin}`};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: 0.5rem;

  &:active,
  &:focus {
    outline: none;
  }
`;

const SendInput = styled.input`
  color: ${({ theme }) => theme.colors.green};
  padding: 0.25em 1em;
`;
