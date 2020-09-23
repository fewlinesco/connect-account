import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "../../../@types/Identity";
import { Box } from "./Box/Box";
import { Button, ButtonVariant } from "./Button/Button";
import { Input } from "./Input/Input";
import { displayAlertBar } from "@src/utils/displayAlertBar";

const IdentityValidationForm: React.FC<{ type: IdentityTypes }> = ({
  type,
}) => {
  const [validationCode, setValidationCode] = React.useState("");
  const router = useRouter();

  return (
    <Wrapper>
      {displayAlertBar(
        type === IdentityTypes.EMAIL.toLowerCase()
          ? "Confirmation email has been sent"
          : "confirmation SMS has been sent",
      )}
      <Form method="post">
        <Box className="instructions">Enter the validation code below</Box>
        <p>Validation code</p>
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
      <p className="didnt-receive-code">Didn&apos;t receive code?</p>
      <Button className="resend-button" variant={ButtonVariant.SECONDARY}>
        Resend confirmation code
      </Button>
    </Wrapper>
  );
};

export default IdentityValidationForm;

const Wrapper = styled.div`
  max-width: 90%;
  margin: 0 auto;

  input {
    width: 100%;
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  button {
    width: 100%;
  }

  .instructions {
    font-weight: ${({ theme }) => theme.fontWeights.light};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }

  .didnt-receive-code {
    margin: 0 0 ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  .send-button {
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  .discard-button {
    margin: 0 0 ${({ theme }) => theme.spaces.component.s} 0;
  }

  .resend-button {
    margin: ${({ theme }) => theme.spaces.component.xxs} 0;
  }
`;

const Form = styled.form`
  display: column;
  align-items: center;
`;
