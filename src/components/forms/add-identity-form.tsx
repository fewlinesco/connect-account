import "react-phone-number-input/style.css";
import { IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputCheckbox } from "../input/input-checkbox";
import { InputText } from "../input/input-text";
import { StyledPhoneInput } from "../input/styled-phone-input";
import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

const AddIdentityForm: React.FC<{
  type: IdentityTypes;
}> = ({ type }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [identity, setIdentity] = React.useState<InMemoryTemporaryIdentity>({
    value: "",
    type,
    expiresAt: Date.now(),
    primary: false,
  });

  const router = useRouter();

  return (
    <>
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          const body = {
            callbackUrl: "/",
            identityInput: identity,
          };

          await fetchJson(
            "/api/auth-connect/send-identity-validation-code",
            HttpVerbs.POST,
            body,
          )
            .then((response) => response.json())
            .then((parsedResponse) => {
              if ("message" in parsedResponse) {
                setFormID(uuidv4());
                setErrorMessage(parsedResponse.message);
              }

              if ("eventId" in parsedResponse) {
                router &&
                  router.push(
                    `/account/logins/${type}/validation/${parsedResponse.eventId}`,
                  );
              }
            });
        }}
      >
        {getIdentityType(type) === IdentityTypes.EMAIL ? (
          <InputText
            type="email"
            name="value"
            placeholder="Enter your email"
            value={identity.value}
            onChange={(value) => {
              setIdentity({
                value: value,
                type,
                expiresAt: Date.now() + 300000,
                primary: identity.primary,
              });
            }}
            label="Email address *"
          />
        ) : (
          <>
            <label htmlFor="styled-phone-input">Phone number *</label>
            <StyledPhoneInput
              id="styled-phone-input"
              placeholder="Enter your phone number"
              value={identity.value}
              defaultCountry="FR"
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
          type="checkbox"
          name="primary"
          onChange={() => {
            setIdentity({
              ...identity,
              primary: !identity.primary,
            });
          }}
          label="Mark this identity as my primary one"
        />

        <Button
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >{`Add ${type.toLowerCase()}`}</Button>
      </Form>

      <NeutralLink href="/account/logins">
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>
    </>
  );
};

export { AddIdentityForm };
