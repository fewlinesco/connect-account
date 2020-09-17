import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "./Button";
import { Input } from "./Input";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import { ReceivedIdentityTypes } from "@src/@types/Identity";
import { useSessionStorage } from "@src/hooks/useSessionStorage";
import { fetchJson } from "@src/utils/fetchJson";

type AddIdentityInputFormProps = {
  type: ReceivedIdentityTypes;
};

export const AddIdentityInputForm: React.FC<AddIdentityInputFormProps> = ({
  type,
}) => {
  const [identity, setIdentity] = useSessionStorage<{
    value: string;
    type: ReceivedIdentityTypes;
    ttl: number;
  }>("identity-value", {
    value: "",
    type,
    ttl: Date.now(),
  });

  const router = useRouter();

  return (
    <Wrapper>
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
        <p>
          {type === ReceivedIdentityTypes.PHONE
            ? "phone number"
            : "email address"}{" "}
          *
        </p>
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
        <Button
          className="send-button"
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 95%;
  margin: 0 auto;

  .send-button {
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  button {
    width: 100%;
  }

  input {
    width: 100%;
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }
`;

export const Form = styled.form`
  display: column;
  align-items: center;
`;
