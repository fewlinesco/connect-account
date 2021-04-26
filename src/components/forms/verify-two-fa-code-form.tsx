import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../input/input-text";
import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { deviceBreakpoints } from "@src/design-system/theme";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";

const VerifyTwoFACodeForm: React.FC<{
  setIsCodeSent: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsCodeSent }) => {
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
        ).then(async (response) => {
          const parsedResponse = await response.json();
          if (response.status >= 400) {
            if ("message" in parsedResponse) {
              if (
                parsedResponse.message === ERRORS_DATA.INVALID_BODY.message ||
                parsedResponse.message ===
                  ERRORS_DATA.INVALID_VALIDATION_CODE.message
              ) {
                setFormID(uuidv4());
                setErrorMessage("Invalid validation code");
                return;
              }

              if (
                parsedResponse.message ===
                ERRORS_DATA.SUDO_EVENT_IDS_NOT_FOUND.message
              ) {
                setFormID(uuidv4());
                setIsCodeSent(false);
                return;
              }
            }
          }

          if ("isCodeVerified" in parsedResponse) {
            router && router.push("/account/security/update");
          }
        });
      }}
    >
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <MultipleInputsMasked
        type="text"
        name="verificationCode"
        onChange={(value) => setVerificationCode(value)}
        value={verificationCode}
        label="Enter received code here:"
        maxLength={6}
        autoFocus={true}
      >
        <InputMask>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </InputMask>
      </MultipleInputsMasked>
      <Button variant={ButtonVariant.PRIMARY} type="submit">
        Confirm
      </Button>
    </ExtendedStyledForm>
  );
};

const ExtendedStyledForm = styled(Form)`
  padding: ${({ theme }) => theme.spaces.xs} 0 0 0;

  p {
    margin-bottom: ${({ theme }) => theme.spaces.xs};
  }

  button {
    margin-bottom: 0;
  }
`;

const MultipleInputsMasked = styled(InputText)`
  border: 0;
  background: none;
  letter-spacing: 4.35rem;
  width: 85%;
  font-size: ${({ theme }) => theme.fontSizes.paragraph};
  font-family: monospace, monospace;
  caret-color: transparent;
  position: relative;
  left: 1.95rem;
  margin: ${({ theme }) => theme.spaces.xs} 0;

  @media ${deviceBreakpoints.m} {
    letter-spacing: 3.3rem;
    width: 27rem;
    left: 1rem;
    padding-left: 1.5rem;
  }
`;

const InputMask = styled.div`
  display: flex;
  justify-content: space-between;
  width: 75%;
  position: absolute;
  top: 0;
  margin: ${({ theme }) => theme.spaces.xs} 0;

  span {
    background: ${({ theme }) => theme.colors.background};
    border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
    height: 4rem;
    border-radius: ${({ theme }) => theme.radii[0]};
    width: 4rem;
    z-index: 0;
  }

  @media ${deviceBreakpoints.m} {
    width: 24.8rem;

    span {
      width: 3.5rem;
    }
  }
`;

export { VerifyTwoFACodeForm };
