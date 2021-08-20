import { Identity } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { FormErrorMessage } from "../input/form-error-message";
import { InputsRadio } from "../input/input-radio-button";
import { Form } from "./form";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { formatErrorMessage } from "@src/configs/intl";
import { deviceBreakpoints } from "@src/design-system/theme";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";
import { formatSnakeCaseToCamelCase } from "@src/utils/format";

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

  const { locale } = useRouter();
  const { formatMessage } = useIntl();

  return (
    <ContactChoiceForm
      formID={formID}
      onSubmit={async () => {
        const body = {
          callbackUrl: "/",
          identityInput: selectedIdentity,
        };

        await fetchJson(
          "/api/auth-connect/send-two-fa-validation-code/",
          "POST",
          body,
        ).then(async (response) => {
          const parsedResponse = await response.json();

          if ("code" in parsedResponse) {
            if (
              parsedResponse.code === ERRORS_DATA.INVALID_IDENTITY_TYPE.code
            ) {
              setErrorMessage(
                formatErrorMessage(
                  locale || "en",
                  formatSnakeCaseToCamelCase(parsedResponse.code),
                ),
              );
              setFormID(uuidv4());
              setIsCodeSent(false);
              return;
            }

            setErrorMessage(
              formatErrorMessage(locale || "en", "somethingWrong"),
            );
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
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : null}
      <p>{formatMessage({ id: "info" })}</p>
      <InputsRadio
        groupName="contactChoice"
        inputsValues={
          identities ? identities.map((identity) => identity.value) : []
        }
        selectedInput={selectedIdentity ? selectedIdentity.value : ""}
        onChange={({ target }) => {
          if (identities) {
            const newIdentity = identities.find(
              (identity) => identity.value === target.value,
            );

            if (newIdentity) {
              setSelectedIdentity(newIdentity);
            }
          }
        }}
        isReady={identities ? true : false}
      />

      <Button
        variant={isCodeSent ? ButtonVariant.SECONDARY : ButtonVariant.PRIMARY}
        type="submit"
      >
        {isCodeSent
          ? formatMessage({ id: "resend" })
          : formatMessage({ id: "send" })}
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

export { SendTwoFACodeForm };
