import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { ButtonVariant } from "../../../@types/ButtonVariant";
import { Identity } from "../../../@types/Identity";
import { Button } from "./Button";

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
        <Button variant={ButtonVariant.PRIMARY} type="submit">
          Send
        </Button>
      </Form>
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Cancel
      </Button>
    </>
  );
};

export const Form = styled.form`
  display: column;
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
