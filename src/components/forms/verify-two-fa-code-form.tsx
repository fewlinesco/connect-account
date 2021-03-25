import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../input/input-text";
import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { fetchJson } from "@src/utils/fetch-json";
import { ERRORS_DATA } from "@src/web-errors";

const VerifyTwoFACodeForm: React.FC = () => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [verificationCode, setVerificationCode] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const router = useRouter();

  return (
    <ExtendedStyledForm
      formID={formID}
      onSubmit={async () => {
        setFormID(uuidv4());

        await fetchJson(
          "/api/auth-connect/verify-two-fa-validation-code",
          HttpVerbs.POST,
          { verificationCode },
        )
          .then((response) => response.json())
          .then((parsedResponse) => {
            console.log(parsedResponse);
            if ("message" in parsedResponse) {
              if (
                parsedResponse.message === ERRORS_DATA.INVALID_BODY.message ||
                parsedResponse.message ===
                  ERRORS_DATA.INVALID_VALIDATION_CODE.message
              ) {
                setFormID(uuidv4());
                setErrorMessage("Invalid validation code");
              }
            }

            // router && router.push("/account/security/update");
          });
      }}
    >
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <InputText
        type="text"
        name="verificationCode"
        onChange={(value) => setVerificationCode(value)}
        value={verificationCode}
        label="Enter received code here:"
        maxLength={6}
      />

      <Button variant={ButtonVariant.PRIMARY} type="submit">
        Confirm
      </Button>
    </ExtendedStyledForm>
  );
};

const ExtendedStyledForm = styled(Form)`
  padding: ${({ theme }) => theme.spaces.xs} 0 0 0;

  button {
    margin-bottom: 0;
  }
`;

export { VerifyTwoFACodeForm };
