import { Identity } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { InputsRadio } from "../input/input-radio-button";
import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { deviceBreakpoints } from "@src/design-system/theme";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";

const SendTwoFACodeForm: React.FC<{
  primaryIdentities: Identity[];
  isCodeSent: boolean;
  setIsCodeSent: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ primaryIdentities, isCodeSent, setIsCodeSent }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [selectedIdentity, setSelectedIdentity] = React.useState<Identity>(
    primaryIdentities[0],
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const inputsValues = primaryIdentities.map((identity) => identity.value);

  return (
    <ContactChoiceForm
      formID={formID}
      onSubmit={async () => {
        const body = {
          callbackUrl: "/",
          identityInput: selectedIdentity,
        };

        await fetchJson(
          "/api/auth-connect/send-two-fa-validation-code",
          HttpVerbs.POST,
          body,
        ).then(async (response) => {
          const parsedResponse = await response.json();

          if ("message" in parsedResponse) {
            if (
              parsedResponse.message ===
              ERRORS_DATA.INVALID_IDENTITY_TYPE.message
            ) {
              setErrorMessage(parsedResponse.message);
              setFormID(uuidv4());
              setIsCodeSent(false);
              return;
            }

            setErrorMessage("Something went wrong. Please try again later");
            setFormID(uuidv4());
            setIsCodeSent(false);
          }

          if ("eventId" in parsedResponse) {
            setErrorMessage(null);
            setFormID(uuidv4());
            setIsCodeSent(true);
          }
        });
      }}
    >
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <p>
        Chose a contact address below that we’ll send a confirmation code to:
      </p>
      <InputsRadio
        groupName="contactChoice"
        inputsValues={inputsValues}
        selectedInput={selectedIdentity.value}
        onChange={({ target }) => {
          const newIdentity = primaryIdentities.find(
            (identity) => identity.value === target.value,
          );

          if (newIdentity) {
            setSelectedIdentity(newIdentity);
          }
        }}
      />
      <Button
        variant={isCodeSent ? ButtonVariant.SECONDARY : ButtonVariant.PRIMARY}
        type="submit"
      >
        {isCodeSent ? "Resend confirmation code" : "Send confirmation code"}
      </Button>
    </ContactChoiceForm>
  );
};

const ContactChoiceForm = styled(Form)`
  padding: ${({ theme }) => theme.spaces.xs} 0;

  p {
    padding-bottom: ${({ theme }) => theme.spaces.xs};
    padding-left: ${({ theme }) => theme.spaces.xs};
  }

  button {
    margin: ${({ theme }) => theme.spaces.xs} 0 0 0;
  }

  @media ${deviceBreakpoints.m} {
    p {
      padding-left: 0;
    }
  }
`;

export { SendTwoFACodeForm };
