import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { FormErrorMessage } from "../input/form-error-message";
import { InputText } from "../input/input-text";
import { Form } from "./form";
import { Button } from "@src/components/buttons";
import { formatErrorMessage } from "@src/configs/intl";
import { deviceBreakpoints } from "@src/design-system/theme";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";
import { formatSnakeCaseToCamelCase } from "@src/utils/format";

const VerifyTwoFACodeForm: React.FC<{
  setIsCodeSent: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsCodeSent }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [verificationCode, setVerificationCode] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const router = useRouter();
  const { formatMessage } = useIntl();

  return (
    <ExtendedStyledForm
      formID={formID}
      onSubmit={async () => {
        setFormID(uuidv4());

        await fetchJson(
          "/api/auth-connect/verify-two-fa-validation-code/",
          "POST",
          { verificationCode },
        ).then(async (response) => {
          const parsedResponse = await response.json();
          if (response.status >= 400) {
            if ("code" in parsedResponse) {
              if (
                parsedResponse.code === ERRORS_DATA.INVALID_BODY.code ||
                parsedResponse.code === ERRORS_DATA.INVALID_VALIDATION_CODE.code
              ) {
                setFormID(uuidv4());
                setErrorMessage(
                  formatErrorMessage(
                    router.locale || "en",
                    formatSnakeCaseToCamelCase(parsedResponse.code),
                  ),
                );
                return;
              }

              if (
                parsedResponse.code ===
                ERRORS_DATA.SUDO_EVENT_IDS_NOT_FOUND.code
              ) {
                setFormID(uuidv4());
                setIsCodeSent(false);
                return;
              }
            }
          }

          if ("isCodeVerified" in parsedResponse) {
            if (router.query.next && typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/account/");
            }
          }
        });
      }}
    >
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : null}
      <MultipleInputsMasked
        type="text"
        name="verificationCode"
        onChange={(value) => setVerificationCode(value)}
        value={verificationCode}
        label={formatMessage({ id: "twoFALabel" })}
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
      <Button className="btn btn-primary" type="submit">
        {formatMessage({ id: "confirm" })}
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
  letter-spacing: 4.65rem;
  width: 75%;
  font-size: ${({ theme }) => theme.fontSizes.paragraph};
  font-family: monospace, monospace;
  caret-color: transparent;
  position: relative;
  left: 2.4rem;
  margin: ${({ theme }) => theme.spaces.xs} 0;

  @media ${deviceBreakpoints.m} {
    letter-spacing: 3.3rem;
    width: 27rem;
    left: 0.9rem;
    padding-left: 1.5rem;
  }
`;

const InputMask = styled.div`
  display: flex;
  justify-content: space-between;
  width: 65%;
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
