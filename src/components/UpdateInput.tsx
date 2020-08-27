import React from "react";
import styled from "styled-components";

import { Identity } from "../@types/Identity";
import { useCookies } from "../hooks/useCookies";
import { updateIdentity } from "../utils/updateIdentity";

export const UpdateInput: React.FC<{
  currentIdentity: Identity;
}> = ({ currentIdentity }) => {
  const [identity, setIdentity] = React.useState("");

  const { data, error } = useCookies();

  if (error) {
    return <div>Failed to load</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <Form
      method="post"
      onSubmit={async () => {
        const deleteBody = {
          userId: data.userId,
          type: currentIdentity.type.toUpperCase(),
          value: currentIdentity.value,
        };

        const updateBody = {
          userId: data.userId,
          type: currentIdentity.type.toUpperCase(),
          value: identity,
        };

        updateIdentity(updateBody, deleteBody);
      }}
    >
      <Input
        type="text"
        name="value"
        placeholder={`Enter your ${currentIdentity.type}`}
        value={identity}
        onChange={(event) => setIdentity(event.target.value)}
      />
      <SendInput type="submit" value="Send" />
    </Form>
  );
};

export const Form = styled.form`
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
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
