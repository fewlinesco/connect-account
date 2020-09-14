import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Identity } from "../../../@types/Identity";
import { Button, ButtonVariant } from "./Button";

export const UpdateIdentityForm: React.FC<{
  updateIdentity: (newValue: string) => Promise<void>;
  currentIdentity: Identity;
}> = ({ currentIdentity, updateIdentity }) => {
  const [identity, setIdentity] = React.useState("");
  const router = useRouter();

  return (
    <Wrapper>
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
        <Button
          className="send-button"
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >
          Update {currentIdentity.type}
        </Button>
      </Form>
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Cancel
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 95%;
  margin: 0 auto;

  button {
    width: 100%;
  }

  .send-button {
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }
`;
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
