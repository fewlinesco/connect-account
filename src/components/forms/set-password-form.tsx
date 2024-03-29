import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import { v4 as uuidv4 } from "uuid";

import { FormErrorMessage } from "../input/form-error-message";
import { InputText } from "../input/input-text/input-text";
import { Form } from "./form";
import { Button } from "@src/components/buttons";
import { PasswordRulesErrorList } from "@src/components/password-rules-error-list";
import { formatErrorMessage } from "@src/configs/intl";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";

const SetPasswordForm: React.FC<{
  submitButtonLabel: string;
}> = ({ submitButtonLabel }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());

  const [passwordInput, setPasswordInput] = React.useState("");
  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    React.useState("");

  const [passwordsNotMatching, setPasswordsNotMatching] = React.useState(false);
  const [passwordRestrictionError, setPasswordRestrictionError] =
    React.useState<Record<string, string> | undefined>();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const router = useRouter();
  const { formatMessage } = useIntl();

  return (
    <Form
      formID={formID}
      onSubmit={async (event) => {
        event && event.preventDefault();

        setPasswordsNotMatching(false);
        setPasswordRestrictionError(undefined);
        setErrorMessage(null);

        if (passwordInput === passwordConfirmationInput) {
          await fetchJson("/api/auth-connect/set-password/", "POST", {
            passwordInput,
          })
            .then(async (response) => {
              const parsedResponse = await response.json();

              if ("details" in parsedResponse) {
                setPasswordRestrictionError(parsedResponse.details);
                setFormID(uuidv4());
                return;
              }

              if ("code" in parsedResponse) {
                if (parsedResponse.code === ERRORS_DATA.INVALID_BODY.code) {
                  setErrorMessage(
                    formatErrorMessage(router.locale || "en", "blankPassword"),
                  );
                  setFormID(uuidv4());
                  return;
                }

                setErrorMessage(
                  formatErrorMessage(router.locale || "en", "somethingWrong"),
                );
              }

              if ("isUpdated" in parsedResponse) {
                router && router.push("/account/security/");
              }
            })
            .catch((error) => {
              throw error;
            });
        } else {
          setFormID(uuidv4());
          setPasswordsNotMatching(true);
        }
      }}
    >
      {passwordRestrictionError ? (
        <PasswordRulesErrorList rules={passwordRestrictionError} />
      ) : null}
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : null}
      <InputText
        type="password"
        name="password-input"
        placeholder={formatMessage({ id: "newPasswordPlaceholder" })}
        value={passwordInput}
        onChange={(value) => setPasswordInput(value)}
        label={formatMessage({ id: "newPasswordLabel" })}
        hasError={errorMessage || passwordRestrictionError ? true : false}
      />
      <InputText
        type="password"
        name="password-confirmation-input"
        placeholder={formatMessage({ id: "confirmNewPasswordPlaceholder" })}
        value={passwordConfirmationInput}
        onChange={(value) => setPasswordConfirmationInput(value)}
        label={formatMessage({ id: "confirmNewPasswordLabel" })}
        hasError={errorMessage || passwordsNotMatching ? true : false}
        errorMessage={
          passwordsNotMatching
            ? formatErrorMessage(router.locale || "en", "passwordMatch")
            : undefined
        }
      />
      <Button className="btn btn-primary" type="submit">
        {submitButtonLabel}
      </Button>
    </Form>
  );
};

export { SetPasswordForm };
