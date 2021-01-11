import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { StyledForm } from "../form/form";
import { PasswordRulesErrorList } from "../password-rules-error-list/password-rules-error-list";
import type { SetPasswordErrorRules } from "@lib/@types/Password";
import { Button, ButtonVariant } from "@src/components/button/button";
import { Input } from "@src/components/input/input";
import { capitalizeFirstLetter } from "@src/utils/format";
import { setPassword } from "@src/workflows/set-password";

type SetPasswordFormProps = {
  conditionalBreadcrumbItem: string;
};

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({
  conditionalBreadcrumbItem,
}) => {
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
  ] = React.useState<SetPasswordErrorRules | undefined>();

  const router = useRouter();

  return (
    <StyledForm
      onSubmit={async (event) => {
        event.preventDefault();

        setIsNotSubmitted(false);
        setPasswordsNotMatching(false);
        setPasswordRestrictionError(undefined);

        if (isNotSubmitted) {
          if (passwordInput === passwordConfirmationInput) {
            const { data, restrictionRulesError } = await setPassword(
              passwordInput,
            );

            if (restrictionRulesError) {
              setPasswordRestrictionError(restrictionRulesError.rules);

              setIsNotSubmitted(true);
            }

            if (data && data.createOrUpdatePassword) {
              router && router.push("/account/security");
            }
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
  passwordRestrictionError?: SetPasswordErrorRules;
  passwordsNotMatching?: boolean;
}>`
  ${({ theme, passwordRestrictionError, passwordsNotMatching }) =>
    (passwordRestrictionError || passwordsNotMatching) &&
    `border-color: ${theme.colors.red};`}
`;
