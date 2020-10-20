import React from "react";

import {
  Button,
  ButtonVariant,
} from "@src/components/display/fewlines/Button/Button";
import { Form } from "@src/components/display/fewlines/Form/Form";
import { Input } from "@src/components/display/fewlines/Input/Input";
import { capitalizeFirstLetter } from "@src/utils/format";

type SetPasswordFormProps = {
  conditionalBreadcrumbItem: string;
  setPassword: (passwordInput: string) => Promise<void>;
};

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({
  conditionalBreadcrumbItem,
  setPassword,
}) => {
  const [passwordInput, setPasswordInput] = React.useState("");
  const [
    passwordConfirmationInput,
    setPasswordConfirmationInput,
  ] = React.useState("");

  return (
    <Form
      onSubmit={async () => {
        if (passwordInput === passwordConfirmationInput) {
          await setPassword(passwordInput);
        } else {
          console.warn(
            "Your password confirmation doesn't match your new password",
          );
        }
      }}
    >
      <p>New password</p>
      <Input
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
    </Form>
  );
};
