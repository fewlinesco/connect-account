import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { ButtonVariant } from "../../../@types/ButtonVariant";
import { IdentityTypes } from "../../../@types/Identity";
import AlertBar from "./AlertBar";
import { Button } from "./Button";

const IdentityValidationForm: React.FC<{ type: IdentityTypes }> = ({
  type,
}) => {
  const [validationCode, setValidationCode] = React.useState("");
  const router = useRouter();

  return (
    <>
      <Form method="post">
        <Input
          type="text"
          name="value"
          placeholder="012345"
          value={validationCode}
          onChange={(event) => setValidationCode(event.target.value)}
        />
        <Button
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >{`Confirm ${type}`}</Button>
      </Form>
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Discard all changes
      </Button>
      <p>Didn&apos;t receive code?</p>
      <Button variant={ButtonVariant.SECONDARY}>
        Resend confirmation code
      </Button>
      <AlertBar type={type} />
    </>
  );
};

export default IdentityValidationForm;

const Form = styled.form`
  display: column;
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
