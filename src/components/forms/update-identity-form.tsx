import "react-phone-number-input/style.css";
import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../input/input-text";
import { StyledPhoneInput } from "../input/styled-phone-input";
import { WrongInputError } from "../input/wrong-input-error";
import { SkeletonTextLine } from "../skeletons/skeletons";
import { Form } from "./form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

const UpdateIdentityForm: React.FC<{
  data?: { identity: Identity };
}> = ({ data }) => {
  const [identity, setIdentity] = React.useState<InMemoryTemporaryIdentity>({
    value: "",
    type: data ? data.identity.type : IdentityTypes.EMAIL,
    expiresAt: Date.now(),
    primary: false,
  });
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const router = useRouter();

  return (
    <>
      <Box>
        <Value>
          {!data ? (
            <SkeletonTextLine fontSize={1.6} />
          ) : (
            <p>{data.identity.value}</p>
          )}
        </Value>
      </Box>
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      {data ? (
        <>
          <Form
            formID={formID}
            onSubmit={async () => {
              const body = {
                callbackUrl: "/",
                identityInput: identity,
                identityToUpdateId: data.identity.id,
              };

              await fetchJson(
                "/api/auth-connect/send-identity-validation-code",
                HttpVerbs.POST,
                body,
              ).then(async (response) => {
                const parsedResponse = await response.json();

                if ("message" in parsedResponse) {
                  if (
                    parsedResponse.message ===
                      ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK.message ||
                    parsedResponse.message ===
                      ERRORS_DATA.INVALID_PHONE_NUMBER_INPUT.message
                  ) {
                    setFormID(uuidv4());
                    setErrorMessage(parsedResponse.message);
                    return;
                  }

                  if (
                    parsedResponse.message === ERRORS_DATA.BAD_REQUEST.message
                  ) {
                    setFormID(uuidv4());
                    setErrorMessage("Something went wrong");
                    return;
                  }

                  setErrorMessage(
                    "Something went wrong. Please try again later",
                  );
                }

                if ("eventId" in parsedResponse) {
                  router &&
                    router.push(
                      `/account/logins/${data.identity.type}/validation/${parsedResponse.eventId}`,
                    );
                }
              });
            }}
          >
            {getIdentityType(data.identity.type) === IdentityTypes.EMAIL ? (
              <InputText
                type="text"
                name="value"
                placeholder={`Enter your ${data.identity.type}`}
                value={identity.value}
                onChange={(value) =>
                  setIdentity({
                    value,
                    type: data.identity.type,
                    expiresAt: Date.now() + 300000,
                    primary: data.identity.primary,
                  })
                }
                label="New email address *"
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
                      type: data.identity.type,
                      expiresAt: Date.now() + 300000,
                      primary: identity.primary,
                    });
                  }}
                />
              </>
            )}
            <Button type="submit" variant={ButtonVariant.PRIMARY}>
              Update {data.identity.type}
            </Button>
          </Form>
          <NeutralLink href="/account/logins">
            <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
          </NeutralLink>{" "}
        </>
      ) : null}
    </>
  );
};

const Value = styled.div`
  margin: ${({ theme }) => theme.spaces.xs} 0;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export { UpdateIdentityForm };
