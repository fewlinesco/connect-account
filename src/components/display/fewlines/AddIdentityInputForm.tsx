import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { ReceivedIdentityTypes } from "../../../@types/Identity";
import { Button, ButtonVariant } from "./Button";
import { Input } from "./Input";

type AddIdentityInputFormProps = {
  addIdentity: (value: string) => Promise<Response>;
  type: ReceivedIdentityTypes;
};

export const AddIdentityInputForm: React.FC<AddIdentityInputFormProps> = ({
  addIdentity,
  type,
}) => {
  const [identity, setIdentity] = React.useState("");
  const router = useRouter();

  return (
    <Wrapper>
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
          value={identity}
          onChange={(event) => setIdentity(event.target.value)}
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
