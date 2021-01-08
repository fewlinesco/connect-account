import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Box } from "../../../box/box";
import { Button, ButtonVariant } from "../../../button/button";
import { FakeButton } from "../../../fake-button/fake-button";
import { Form } from "../../../form/form";
import { Input } from "../../../input/input";
import { NeutralLink } from "../neutral-link/neutral-link";
import { IdentityTypes } from "@lib/@types/Identity";
import {
  InvalidValidationCode,
  TemporaryIdentityExpired,
} from "@src/client-errors";
import { displayAlertBar } from "@src/utils/display-alert-bar";
import { validateIdentity } from "@src/workflows/validate-identity";

export const ValidateIdentityForm: React.FC<{
  type: IdentityTypes;
  eventId: string;
}> = ({ type, eventId }) => {
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
          await validateIdentity(validationCode, eventId)
            .then((path) => {
              router && router.push(path);
            })
            .catch((error) => {
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
            : "Confirmation SMS has been sent",
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
        <FakeButton variant={ButtonVariant.SECONDARY}>
          Discard all changes
        </FakeButton>
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
