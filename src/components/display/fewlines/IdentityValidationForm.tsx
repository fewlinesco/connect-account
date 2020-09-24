import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Box } from "./Box/Box";
import { Button, ButtonVariant } from "./Button/Button";
import { Input } from "./Input/Input";
import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs/NavigationBreadcrumbs";
import { IdentityTypes } from "@lib/@types/Identity";
import { displayAlertBar } from "@src/utils/displayAlertBar";

const IdentityValidationForm: React.FC<{
  type: IdentityTypes;
  verifyIdentity: (validationCode: string) => Promise<void>;
}> = ({ type, verifyIdentity }) => {
  const [validationCode, setValidationCode] = React.useState("");

  const router = useRouter();

  return (
    <Wrapper>
      <NavigationBreadcrumbs
        title="Logins"
        breadcrumbs={`${
          type === IdentityTypes.EMAIL.toLowerCase()
            ? "Email address"
            : "Phone number"
        } | validation
      `}
      />
      <Form
        method="post"
        onSubmit={async (event) => {
          event.preventDefault();

          await verifyIdentity(validationCode);
        }}
      >
        {displayAlertBar(
          type.toUpperCase() === IdentityTypes.EMAIL
            ? "Confirmation email has been sent"
            : "confirmation SMS has been sent",
        )}

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
        >{`Confirm ${type.toLowerCase()}`}</Button>
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

export const Form = styled.form`
  display: column;
  align-items: center;
`;
