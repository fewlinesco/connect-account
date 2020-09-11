import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { ButtonVariant } from "../../../@types/ButtonVariant";
import { IdentityTypes } from "../../../@types/Identity";
import { Button } from "./Button";

type AddIdentityInputFormProps = {
  addIdentity: (value: string) => Promise<Response>;
  type: IdentityTypes;
};

export const AddIdentityInputForm: React.FC<AddIdentityInputFormProps> = ({
  addIdentity,
  type,
}) => {
  const [identity, setIdentity] = React.useState("");
  const router = useRouter();

  return (
    <>
      <Form
        method="post"
        onSubmit={async (event) => {
          event.preventDefault();
          return await addIdentity(identity)
            .then(() => {
              router && router.push(`/account/logins/${type}/validation`);
            })
            .catch((error: Error) => {
              throw error;
            });
        }}
      >
        <Input
          type="text"
          name="value"
          placeholder={`Enter your ${type}`}
          value={identity}
          onChange={(event) => setIdentity(event.target.value)}
        />
        <Button
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >{`Add ${type}`}</Button>
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
