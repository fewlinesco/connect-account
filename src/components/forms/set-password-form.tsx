import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { FormErrorMessage } from "../input/form-error-message";
import { InputText } from "../input/input-text";
import { StyledForm } from "./form";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { PasswordRulesErrorList } from "@src/components/password-rules-error-list/password-rules-error-list";
import { formatErrorMessage } from "@src/configs/intl";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";
import { capitalizeFirstLetter } from "@src/utils/format";

const SetPasswordForm: React.FC<{
  conditionalBreadcrumbItem: string;
}> = ({ conditionalBreadcrumbItem }) => {
  const [isNotSubmitted, setIsNotSubmitted] = React.useState(true);

  const [passwordInput, setPasswordInput] = React.useState("");
  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    React.useState("");

  const [passwordsNotMatching, setPasswordsNotMatching] = React.useState(false);
  const [passwordRestrictionError, setPasswordRestrictionError] =
    React.useState<Record<string, string> | undefined>();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const router = useRouter();

  return (
    <StyledForm
      onSubmit={async (event) => {
        event.preventDefault();

        setIsNotSubmitted(false);
        setPasswordsNotMatching(false);
        setPasswordRestrictionError(undefined);
        setErrorMessage(null);

        if (isNotSubmitted) {
          if (passwordInput === passwordConfirmationInput) {
            await fetchJson("/api/auth-connect/set-password", "POST", {
              passwordInput,
            })
              .then(async (response) => {
                const parsedResponse = await response.json();

                if ("details" in parsedResponse) {
                  setPasswordRestrictionError(parsedResponse.details);
                  setIsNotSubmitted(true);
                  return;
                }

                if ("message" in parsedResponse) {
                  if (
                    parsedResponse.message === ERRORS_DATA.INVALID_BODY.message
                  ) {
                    setErrorMessage(
                      formatErrorMessage(
                        router.locale || "en",
                        "passwordMatch",
                      ),
                    );
                    setIsNotSubmitted(true);
                    return;
                  }

                  setErrorMessage(
                    formatErrorMessage(router.locale || "en", "somethingWrong"),
                  );
                }

                if ("isUpdated" in parsedResponse) {
                  router && router.push("/account/security");
                }
              })
              .catch((error) => {
                throw error;
              });
          } else {
            setIsNotSubmitted(true);
            setPasswordsNotMatching(true);
          }
        }
      }}
    >
      {passwordRestrictionError ? (
        <PasswordRulesErrorList rules={passwordRestrictionError} />
      ) : null}
      {passwordsNotMatching ? (
        <MismatchedPassword>
          {formatErrorMessage(router.locale || "en", "passwordMatch")}
        </MismatchedPassword>
      ) : null}
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : null}
      <ExtendedInputStyle
        type="password"
        name="password-input"
        placeholder="New password"
        value={passwordInput}
        passwordRestrictionError={passwordRestrictionError}
        passwordsNotMatching={passwordsNotMatching}
        onChange={(value) => setPasswordInput(value)}
        label="New password"
      />
      <InputText
        type="password"
        name="password-confirmation-input"
        placeholder="Confirm new password"
        value={passwordConfirmationInput}
        onChange={(value) => setPasswordConfirmationInput(value)}
        label="Confirm new password"
      />
      <Button
        variant={ButtonVariant.PRIMARY}
        type="submit"
      >{`${capitalizeFirstLetter(conditionalBreadcrumbItem)} password`}</Button>
    </StyledForm>
  );
};

const MismatchedPassword = styled.p`
  color: ${({ theme }) => theme.colors.red};
  margin-bottom: 2rem;
`;

const ExtendedInputStyle = styled(InputText)<{
  passwordRestrictionError?: Record<string, string>;
  passwordsNotMatching?: boolean;
}>`
  ${({ theme, passwordRestrictionError, passwordsNotMatching }) =>
    (passwordRestrictionError || passwordsNotMatching) &&
    `border-color: ${theme.colors.red};`}
`;

export { SetPasswordForm };
