import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "../../../@types/Identity";
import AlertBar from "./AlertBar";
import { Button, ButtonVariant } from "./Button";
import { Input } from "./Input";

const IdentityValidationForm: React.FC<{ type: IdentityTypes }> = ({
  type,
}) => {
  const [validationCode, setValidationCode] = React.useState("");
  const router = useRouter();

  return (
    <Wrapper>
      <Form method="post">
        <Input
          type="text"
          name="value"
          placeholder="012345"
          value={validationCode}
          onChange={(event) => setValidationCode(event.target.value)}
        />
        <Button
          className="send-button"
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >{`Confirm ${type}`}</Button>
      </Form>
      <Button
        className="discard-button"
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Discard all changes
      </Button>
      <p>Didn&apos;t receive code?</p>
      <Button className="resend-button" variant={ButtonVariant.SECONDARY}>
        Resend confirmation code
      </Button>
      <AlertBar type={type} />
    </Wrapper>
  );
};

export default IdentityValidationForm;

const Wrapper = styled.div`
  max-width: 95%;
  margin: 0 auto;

  input {
    width: 100%;
  }

  button {
    width: 100%;
  }

  .send-button {
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  .discard-button {
    margin: 0 0 ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  .resend-button {
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }
`;

const Form = styled.form`
  display: column;
  align-items: center;
`;
