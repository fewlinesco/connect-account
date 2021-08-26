import { IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import { v4 as uuidv4 } from "uuid";

import { FormErrorMessage } from "../../input/form-error-message";
import { InputCheckbox } from "../../input/input-checkbox";
import { StyledPhoneInput } from "../../input/styled-phone-input/styled-phone-input";
import { Form } from "../form";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { Button } from "@src/components/buttons";
import { InputText } from "@src/components/input/input-text/input-text";
import { NeutralLink } from "@src/components/neutral-link";
import { formatErrorMessage } from "@src/configs/intl";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";
import { formatSnakeCaseToCamelCase } from "@src/utils/format";
import { getIdentityType } from "@src/utils/get-identity-type";

const AddIdentityForm: React.FC<{
  type: IdentityTypes;
}> = ({ type }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [identity, setIdentity] = React.useState<InMemoryTemporaryIdentity>({
    value: "",
    type,
    expiresAt: Date.now(),
    primary: false,
  });

  return (
    <>
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          const body = {
            callbackUrl: "/",
            identityInput: identity,
          };

          await fetchJson(
            "/api/auth-connect/send-identity-validation-code/",
            "POST",
            body,
          ).then(async (response) => {
            const parsedResponse = await response.json();

            if ("code" in parsedResponse) {
              if (
                parsedResponse.code ===
                  ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK.code ||
                parsedResponse.code ===
                  ERRORS_DATA.INVALID_PHONE_NUMBER_INPUT.code
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

              if (parsedResponse.code === ERRORS_DATA.BAD_REQUEST.code) {
                setFormID(uuidv4());
                setErrorMessage(
                  formatErrorMessage(router.locale || "en", "somethingWrong"),
                );
                return;
              }

              setErrorMessage(
                formatErrorMessage(router.locale || "en", "somethingWrong"),
              );
            }

            if ("eventId" in parsedResponse) {
              router &&
                router.push(
                  `/account/logins/${type}/validation/${parsedResponse.eventId}/`,
                );
            }
          });
        }}
      >
        {getIdentityType(type) === IdentityTypes.EMAIL ? (
          <InputText
            type="email"
            name="value"
            placeholder={formatMessage({ id: "emailPlaceholder" })}
            value={identity.value}
            onChange={(value) => {
              setIdentity({
                value: value,
                type,
                expiresAt: Date.now() + 300000,
                primary: identity.primary,
              });
            }}
            label={formatMessage({ id: "emailInputLabel" })}
            hasError={errorMessage ? true : false}
          />
        ) : (
          <>
            <label htmlFor="styled-phone-input">
              {formatMessage({ id: "phoneInputLabel" })}
            </label>
            <StyledPhoneInput
              id="styled-phone-input"
              placeholder={formatMessage({ id: "phonePlaceholder" })}
              value={identity.value}
              defaultCountry={router.locale === "en" ? "GB" : "FR"}
              countryOptionsOrder={["GB", "FR", "|", "..."]}
              onChange={(value) => {
                setIdentity({
                  value,
                  type,
                  expiresAt: Date.now() + 300000,
                  primary: identity.primary,
                });
              }}
            />
          </>
        )}
        <InputCheckbox
          name="primary"
          onChange={() => {
            setIdentity({
              ...identity,
              primary: !identity.primary,
            });
          }}
          label={formatMessage({ id: "markIdentity" })}
        />
        <Button className="btn btn-primary" type="submit">
          {getIdentityType(type) === IdentityTypes.EMAIL
            ? formatMessage({ id: "addEmail" })
            : formatMessage({ id: "addPhone" })}
        </Button>
      </Form>
      <NeutralLink href="/account/logins/">
        <div className="btn btn-secondary btn-neutral-link">
          {formatMessage({ id: "cancel" })}
        </div>
      </NeutralLink>
    </>
  );
};

export { AddIdentityForm };
