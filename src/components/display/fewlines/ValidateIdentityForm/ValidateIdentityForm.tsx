import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Box } from "../Box/Box";
import { Button, ButtonVariant } from "../Button/Button";
import { Form } from "../Form/Form";
import { Input } from "../Input/Input";
import { NeutralLink } from "../NeutralLink";
import { IdentityTypes } from "@lib/@types/Identity";
import {
  InvalidValidationCode,
  TemporaryIdentityExpired,
} from "@src/clientErrors";
import { displayAlertBar } from "@src/utils/displayAlertBar";

export const ValidateIdentityForm: React.FC<{
  type: IdentityTypes;
  validateIdentity: (validationCode: string) => Promise<void>;
}> = ({ type, validateIdentity }) => {
  const [validationCode, setValidationCode] = React.useState<string>("");
  const [flashMessage, setFlashMessage] = React.useState<string>("");
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const router = useRouter();

  return (
    <>
      {flashMessage ? <WrongInputError>{flashMessage}.</WrongInputError> : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          await validateIdentity(validationCode).catch((error) => {
            if (error instanceof InvalidValidationCode) {
              setFormID(uuidv4());
              setFlashMessage(error.message);
            } else if (error instanceof TemporaryIdentityExpired) {
              router && router.push("/account/logins/email/new");
            } else {
              throw error;
            }
          });
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

      <NeutralLink href="/account/logins">
        <Button variant={ButtonVariant.SECONDARY}>Discard all changes</Button>
      </NeutralLink>

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

const WrongInputError = styled.p`
  color: ${({ theme }) => theme.colors.red};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 3rem;
`;
