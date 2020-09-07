import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "../../../@types/Identity";
import { Button } from "../../../pages/account/logins/index";

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
          return await addIdentity(identity).then(() => {
            router && router.push(`/account/logins/${type}/validation`);
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
        <SendInput type="submit" value={`Add ${type}`} />
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

const SendInput = styled.input`
  color: ${({ theme }) => theme.colors.green};
  padding: 0.25em 1em;
`;
