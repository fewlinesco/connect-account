import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { StyledForm } from "../Form/Form";
import { PasswordRulesErrorList } from "../PasswordRulesErrorList/PasswordRulesErrorList";
import { SetPasswordError, SetPasswordErrorRules } from "@lib/@types/Password";
import { CreateOrUpdatePassword } from "@lib/commands/createOrUpdatePassword";
import {
  Button,
  ButtonVariant,
} from "@src/components/display/fewlines/Button/Button";
import { Input } from "@src/components/display/fewlines/Input/Input";
import { capitalizeFirstLetter } from "@src/utils/format";

type SetPasswordFormProps = {
  conditionalBreadcrumbItem: string;
  setPassword: (passwordInput: string) => Promise<CreateOrUpdatePassword>;
};

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({
  conditionalBreadcrumbItem,
  setPassword,
}) => {
  const [isNotSubmitted, setIsNotSubmitted] = React.useState(true);

  const [passwordInput, setPasswordInput] = React.useState("");
  const [
    passwordConfirmationInput,
    setPasswordConfirmationInput,
  ] = React.useState("");

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

        if (isNotSubmitted) {
          if (passwordInput === passwordConfirmationInput) {
            const { data, errors } = await setPassword(passwordInput);

            if (errors) {
              setPasswordRestrictionError(
                ((errors[0] as unknown) as SetPasswordError).rules,
              );

              setIsNotSubmitted(true);
            }

            if (data && data.createOrUpdatePassword) {
              router && router.push("/account/security");
            }
          } else {
            setIsNotSubmitted(true);

            console.warn(
              "Your password confirmation doesn't match your new password",
            );
          }
        }
      }}
    >
      {passwordRestrictionError ? (
        <PasswordRulesErrorList rules={passwordRestrictionError} />
      ) : null}
      <p>New password</p>
      <ExtendedInputStyle
        type="password"
        name="password-input"
        placeholder="New password"
        value={passwordInput}
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

const ExtendedInputStyle = styled(Input)<{
  passwordRestrictionError?: Pick<SetPasswordError, "rules">;
}>`
  ${({ theme, passwordRestrictionError }) =>
    passwordRestrictionError && `border-color: ${theme.colors.red};`}
`;
