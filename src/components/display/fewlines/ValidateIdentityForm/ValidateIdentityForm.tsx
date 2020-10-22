import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { Form } from "../Form/Form";
import { Input } from "../Input/Input";
import { IdentityTypes } from "@lib/@types/Identity";
import { displayAlertBar } from "@src/utils/displayAlertBar";

const ValidateIdentityForm: React.FC<{
  type: IdentityTypes;
  validateIdentity: (validationCode: string) => Promise<void>;
}> = ({ type, validateIdentity }) => {
  const [validationCode, setValidationCode] = React.useState("");

  const router = useRouter();

  return (
    <>
      <Form
        onSubmit={async () => {
          await validateIdentity(validationCode);
        }}
      >
        {displayAlertBar(
          type.toUpperCase() === IdentityTypes.EMAIL
            ? "Confirmation email has been sent"
            : "confirmation SMS has been sent",
        )}

        <Box>
          <Value>Enter the validation code below</Value>
        </Box>
        <p>Validation code</p>
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
        >{`Confirm ${type.toLowerCase()}`}</Button>
      </Form>
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Discard all changes
      </Button>
      <DidntReceiveCode>Didn&apos;t receive code?</DidntReceiveCode>
      <Button variant={ButtonVariant.SECONDARY}>
        Resend confirmation code
      </Button>
    </>
  );
};

export default ValidateIdentityForm;

const DidntReceiveCode = styled.p`
  margin: ${({ theme }) => theme.spaces.xs} 0 ${({ theme }) => theme.spaces.xxs};
`;

const Value = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: ${({ theme }) => theme.fontSizes.s};
`;
