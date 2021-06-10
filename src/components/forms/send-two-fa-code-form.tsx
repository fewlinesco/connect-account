import { Identity } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { FormErrorMessage } from "../input/form-error-message";
import { InputsRadio, Label } from "../input/input-radio-button";
import { SkeletonTextLine } from "../skeletons/skeletons";
import { Form } from "./form";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { deviceBreakpoints } from "@src/design-system/theme";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";

const SendTwoFACodeForm: React.FC<{
  isCodeSent: boolean;
  setIsCodeSent: React.Dispatch<React.SetStateAction<boolean>>;
  identities?: Identity[];
}> = ({ isCodeSent, setIsCodeSent, identities }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [selectedIdentity, setSelectedIdentity] =
    React.useState<Identity | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (identities) {
      setSelectedIdentity(identities[0]);
    }
  }, [identities]);

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
          "POST",
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
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}.</FormErrorMessage>
      ) : null}
      <p>Choose a contact means below that we’ll send a validation code to:</p>
      {identities ? (
        <InputsRadio
          groupName="contactChoice"
          inputsValues={identities.map((identity) => identity.value)}
          selectedInput={selectedIdentity ? selectedIdentity.value : ""}
          onChange={({ target }) => {
            const newIdentity = identities.find(
              (identity) => identity.value === target.value,
            );

            if (newIdentity) {
              setSelectedIdentity(newIdentity);
            }
          }}
          isReady={true}
        />
      ) : (
        <InputRadioWrapper>
          <SkeletonTextLine fontSize={1.6} width={50} />
          <span />
        </InputRadioWrapper>
      )}

      <Button
        variant={isCodeSent ? ButtonVariant.SECONDARY : ButtonVariant.PRIMARY}
        type="submit"
      >
        {isCodeSent ? "Resend validation code" : "Send validation code"}
      </Button>
    </ContactChoiceForm>
  );
};

const ContactChoiceForm = styled(Form)`
  padding: ${({ theme }) => theme.spaces.xs} 0;

  & > p {
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

const InputRadioWrapper = styled(Label)`
  span {
    border: ${({ theme }) => theme.borders.normal};
  }

  span:after {
    content: "";
    height: 1rem;
    width: 1rem;
    background-color: ${({ theme }) => theme.colors.primary};
    position: absolute;
    border-radius: ${({ theme }) => theme.radii[3]};
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

export { SendTwoFACodeForm };
