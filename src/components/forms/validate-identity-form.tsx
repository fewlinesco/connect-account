import { IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { Input } from "@src/components/input/input";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { InvalidValidationCode, TemporaryIdentityExpired } from "@src/errors";
import { fetchJson } from "@src/utils/fetch-json";
import { validateIdentity } from "@src/workflows/validate-identity";

const ValidateIdentityForm: React.FC<{
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
          type="submit"
          variant={ButtonVariant.PRIMARY}
        >{`Confirm ${type.toLowerCase()}`}</Button>
      </Form>

      <NeutralLink href="/account/logins">
        <FakeButton variant={ButtonVariant.SECONDARY}>
          Discard all changes
        </FakeButton>
      </NeutralLink>

      <DidntReceiveCode>Didn&apos;t receive code?</DidntReceiveCode>
      <Button
        type="button"
        variant={ButtonVariant.SECONDARY}
        onClick={async () => {
          await fetchJson(
            "/api/auth-connect/re-send-identity-validation-code",
            HttpVerbs.POST,
            { eventId },
          )
            .then(async (response) => await response.json())
            .then(({ eventId }) =>
              router.push(`/account/logins/${type}/validation/${eventId}`),
            );
        }}
      >
        Resend validation code
      </Button>
    </>
  );
};

const DidntReceiveCode = styled.p`
  margin: ${({ theme }) => theme.spaces.s} 0 ${({ theme }) => theme.spaces.xs};
`;

const Value = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: ${({ theme }) => theme.fontSizes.s};
`;

export { ValidateIdentityForm };
