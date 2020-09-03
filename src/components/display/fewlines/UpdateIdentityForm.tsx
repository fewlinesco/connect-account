import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Identity } from "../../../@types/Identity";

export const UpdateIdentityForm: React.FC<{
  updateIdentity: (newValue: string) => Promise<void>;
  currentIdentity: Identity;
}> = ({ currentIdentity, updateIdentity }) => {
  const [identity, setIdentity] = React.useState("");
  const router = useRouter();

  return (
    <>
      <Form
        method="post"
        onSubmit={async (event) => {
          event.preventDefault();
          updateIdentity(identity);
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
      <Button onClick={() => router.push("/account/logins/")}>Cancel</Button>
    </>
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

const Button = styled.button`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.green};
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.green};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
  &:active,
  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.green};
    color: ${({ theme }) => theme.colors.contrastCopy};
  }
`;

const SendInput = styled.input`
  color: ${({ theme }) => theme.colors.green};
  padding: 0.25em 1em;
`;
