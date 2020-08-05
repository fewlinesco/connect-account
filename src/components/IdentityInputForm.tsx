import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "../@types/Identity";
import { useCookies } from "../hooks/useCookies";

export const IdentityInputForm: React.FC<{ type: IdentityTypes }> = ({
  type,
}) => {
  const [identity, setIdentity] = React.useState("");

  const { data, error } = useCookies();

  if (error) return <div>failed to load</div>;
  if (!data) return <React.Fragment />;

  return (
    <Form
      data-testid="identity-form"
      method="post"
      onSubmit={() => {
        const body = {
          userId: data.userId,
          type,
          value: identity,
        };

        fetch("/api/account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
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
