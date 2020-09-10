import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { HttpVerbs } from "../../../@types/HttpVerbs";
import { IdentityTypes } from "../../../@types/Identity";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { fetchJson } from "../../../utils/fetchJson";
import AlertBar from "./AlertBar";

const IdentityValidationForm: React.FC<{ type: IdentityTypes }> = ({
  type,
}) => {
  const [validationCode, setValidationCode] = React.useState("");
  const router = useRouter();
  const [identity] = useSessionStorage<{
    value: string;
    type: IdentityTypes;
    ttl: number;
  }>("identity-value", {
    value: "",
    type,
    ttl: Date.now(),
  });

  return (
    <>
      <Form
        method="post"
        onSubmit={async () => {
          const body = {
            identity,
            validationCode,
          };

          fetchJson("/api/identity", HttpVerbs.POST, body);
        }}
      >
        <Input
          type="text"
          name="value"
          placeholder="012345"
          value={validationCode}
          onChange={(event) => setValidationCode(event.target.value)}
        />
        <SendInput type="submit" value={`Confirm ${type}`} />
      </Form>
      <Button onClick={() => router.push("/account/logins/")}>
        Discard all changes
      </Button>
      <p>Didn&apos;t receive code?</p>
      <Button>Resend confirmation code</Button>
      <AlertBar type={type} />
    </>
  );
};

export default IdentityValidationForm;

export const Button = styled.button`
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
