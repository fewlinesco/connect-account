import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../../../@types/HttpVerbs";
import { IdentityTypes } from "../../../@types/Identity";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { Button } from "../../../pages/account/logins/index";
import { fetchJson } from "../../../utils/fetchJson";

type AddIdentityInputFormProps = {
  type: IdentityTypes;
};

export const AddIdentityInputForm: React.FC<AddIdentityInputFormProps> = ({
  type,
}) => {
  const [identity, setIdentity] = useSessionStorage<{
    value: string;
    type: IdentityTypes;
    ttl: number;
  }>("identity-value", {
    value: "",
    type,
    ttl: Date.now(),
  });

  const router = useRouter();

  return (
    <>
      <Form
        method="post"
        onSubmit={async (event) => {
          event.preventDefault();

          const body = {
            callbackUrl: "/",
            type,
            value: identity.value,
          };

          fetchJson("/api/send-identity-validation-code", HttpVerbs.POST, body);

          router && router.push(`/account/logins/${type}/validation`);
        }}
      >
        <Input
          type="text"
          name="value"
          placeholder={`Enter your ${type}`}
          value={identity.value}
          onChange={(event) =>
            setIdentity({
              value: event.target.value,
              type,
              ttl: Date.now() + 300,
            })
          }
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
