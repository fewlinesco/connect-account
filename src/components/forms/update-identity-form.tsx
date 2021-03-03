import "react-phone-number-input/style.css";
import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { StyledPhoneInput } from "../input/styled-phone-input";
import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { Input } from "@src/components/input/input";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

const UpdateIdentityForm: React.FC<{
  currentIdentity: Identity;
}> = ({ currentIdentity }) => {
  const [identity, setIdentity] = React.useState<InMemoryTemporaryIdentity>({
    value: "",
    type: currentIdentity.type,
    expiresAt: Date.now(),
    primary: false,
  });
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { value } = currentIdentity;

  const router = useRouter();

  return (
    <>
      <Box key={value}>
        <Value>{value}</Value>
      </Box>
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          const body = {
            callbackUrl: "/",
            identityInput: identity,
            identityToUpdateId: currentIdentity.id,
          };

          await fetchJson(
            "/api/auth-connect/send-identity-validation-code",
            HttpVerbs.POST,
            body,
          )
            .then((response) => response.json())
            .then(async (parsedResponse) => {
              if ("message" in parsedResponse) {
                setFormID(uuidv4());
                setErrorMessage(parsedResponse.message);
              }

              if ("eventId" in parsedResponse) {
                router &&
                  router.push(
                    `/account/logins/${currentIdentity.type}/validation/${parsedResponse.eventId}`,
                  );
              }
            });
        }}
      >
        <p>
          New{" "}
          {getIdentityType(currentIdentity.type) === IdentityTypes.PHONE
            ? "phone number *"
            : "email address *"}
        </p>
        {getIdentityType(currentIdentity.type) === IdentityTypes.EMAIL ? (
          <Input
            type="text"
            name="value"
            placeholder={`Enter your ${currentIdentity.type}`}
            value={identity.value}
            onChange={(event) =>
              setIdentity({
                value: event.target.value,
                type: currentIdentity.type,
                expiresAt: Date.now() + 300000,
                primary: currentIdentity.primary,
              })
            }
          />
        ) : (
          <StyledPhoneInput
            placeholder="Enter your phone number"
            value={identity.value}
            defaultCountry="FR"
            onChange={(value) => {
              setIdentity({
                value,
                type: currentIdentity.type,
                expiresAt: Date.now() + 300000,
                primary: identity.primary,
              });
            }}
          />
        )}
        <Button variant={ButtonVariant.PRIMARY} type="submit">
          Update {currentIdentity.type}
        </Button>
      </Form>

      <NeutralLink href="/account/logins">
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>
    </>
  );
};

const Value = styled.p`
  margin-right: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export { UpdateIdentityForm };
