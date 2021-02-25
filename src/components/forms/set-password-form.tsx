import { PasswordRules } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { WrongInputError } from "../input/wrong-input-error";
import { StyledForm } from "./form";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { Input } from "@src/components/input/input";
import { PasswordRulesErrorList } from "@src/components/password-rules-error-list/password-rules-error-list";
import { capitalizeFirstLetter } from "@src/utils/format";
import { setPassword } from "@src/workflows/set-password";

const SetPasswordForm: React.FC<{
  conditionalBreadcrumbItem: string;
}> = ({ conditionalBreadcrumbItem }) => {
  const [isNotSubmitted, setIsNotSubmitted] = React.useState(true);

  const [passwordInput, setPasswordInput] = React.useState("");
  const [
    passwordConfirmationInput,
    setPasswordConfirmationInput,
  ] = React.useState("");

  const [passwordsNotMatching, setPasswordsNotMatching] = React.useState(false);
  const [
    passwordRestrictionError,
    setPasswordRestrictionError,
  ] = React.useState<PasswordRules | undefined>();
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
            await setPassword(passwordInput)
              .then((response) => {
                if ("details" in response) {
                  setPasswordRestrictionError(response.details);
                  setIsNotSubmitted(true);
                }

                if ("message" in response && response.code === "invalid_body") {
                  setErrorMessage("Password can't be blank");
                  setIsNotSubmitted(true);
                }

                if ("isUpdated" in response) {
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
          Your password confirmation do not match your new password.
        </MismatchedPassword>
      ) : null}
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <p>New password</p>
      <ExtendedInputStyle
        type="password"
        name="password-input"
        placeholder="New password"
        value={passwordInput}
        passwordRestrictionError={passwordRestrictionError}
        passwordsNotMatching={passwordsNotMatching}
        onChange={(event) => setPasswordInput(event.target.value)}
      />
      <p>Confirm new password</p>
      <Input
        type="password"
        name="password-confirmation-input"
        placeholder="Confirm new password"
        value={passwordConfirmationInput}
        onChange={(event) => setPasswordConfirmationInput(event.target.value)}
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

const ExtendedInputStyle = styled(Input)<{
  passwordRestrictionError?: PasswordRules;
  passwordsNotMatching?: boolean;
}>`
  ${({ theme, passwordRestrictionError, passwordsNotMatching }) =>
    (passwordRestrictionError || passwordsNotMatching) &&
    `border-color: ${theme.colors.red};`}
`;

export { SetPasswordForm };
