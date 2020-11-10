import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { Form } from "../Form/Form";
import { Input } from "../Input/Input";
import { NeutralLink } from "../NeutralLink";
import { IdentityTypes } from "@lib/@types/Identity";
import { displayAlertBar } from "@src/utils/displayAlertBar";

export const ValidateIdentityForm: React.FC<{
  type: IdentityTypes;
  validateIdentity: (validationCode: string) => Promise<void>;
}> = ({ type, validateIdentity }) => {
  const [validationCode, setValidationCode] = React.useState("");

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
      <Link href="/account/logins" passHref>
        <NeutralLink>
          <Button variant={ButtonVariant.SECONDARY}>Discard all changes</Button>
        </NeutralLink>
      </Link>

      <DidntReceiveCode>Didn&apos;t receive code?</DidntReceiveCode>
      <Button variant={ButtonVariant.SECONDARY}>
        Resend confirmation code
      </Button>
    </>
  );
};

const DidntReceiveCode = styled.p`
  margin: ${({ theme }) => theme.spaces.xs} 0 ${({ theme }) => theme.spaces.xxs};
`;

const Value = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: ${({ theme }) => theme.fontSizes.s};
`;
