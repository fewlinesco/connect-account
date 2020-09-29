import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "./Button/Button";
import { Input } from "./Input/Input";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import { ReceivedIdentityTypes } from "@src/@types/Identity";
import { fetchJson } from "@src/utils/fetchJson";

export const AddIdentityInputForm: React.FC<{
  type: ReceivedIdentityTypes;
}> = ({ type }) => {
  const [identity, setIdentity] = React.useState<{
    value: string;
    type: ReceivedIdentityTypes;
    expiresAt: number;
  }>({
    value: "",
    type,
    expiresAt: Date.now(),
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
            identityInput: identity,
          };

          const eventId = await fetchJson(
            "/api/auth-connect/send-identity-validation-code",
            HttpVerbs.POST,
            body,
          ).then((data) => data.json());

          router &&
            router.push(`/account/logins/${type}/validation/${eventId.data}`);
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
              expiresAt: Date.now() + 300,
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
  max-width: 90%;
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
