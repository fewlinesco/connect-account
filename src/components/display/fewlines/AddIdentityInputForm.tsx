import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "./Button/Button";
import { Input } from "./Input/Input";
import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs/NavigationBreadcrumbs";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import {
  InMemoryTemporaryIdentity,
  ReceivedIdentityTypes,
} from "@src/@types/Identity";
import { fetchJson } from "@src/utils/fetchJson";

export const AddIdentityInputForm: React.FC<{
  type: ReceivedIdentityTypes;
  addIdentity: (identity: InMemoryTemporaryIdentity) => Promise<void>;
}> = ({ type, addIdentity }) => {
  const [identity, setIdentity] = React.useState<InMemoryTemporaryIdentity>({
    value: "",
    type,
    expiresAt: Date.now(),
  });

  const router = useRouter();

  return (
    <Wrapper>
      <NavigationBreadcrumbs
        title="Logins"
        breadcrumbs={`${
          type === ReceivedIdentityTypes.EMAIL
            ? "Email address"
            : "Phone number "
        } | new
      `}
      />
      <Form
        method="post"
        onSubmit={async (event) => {
          event.preventDefault();

          await addIdentity(identity);
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
