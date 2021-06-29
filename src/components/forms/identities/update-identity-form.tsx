import "react-phone-number-input/style.css";
import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { FormErrorMessage } from "../../input/form-error-message";
import { InputText } from "../../input/input-text";
import { StyledPhoneInput } from "../../input/styled-phone-input";
import { SkeletonTextLine } from "../../skeletons/skeletons";
import { Form } from "../form";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { formatErrorMessage } from "@src/configs/intl";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";
import { formatSnakeCaseToCamelCase } from "@src/utils/format";
import { getIdentityType } from "@src/utils/get-identity-type";

const UpdateIdentityForm: React.FC<{
  identity?: Identity;
}> = ({ identity }) => {
  const [modifiedIdentity, setIdentity] =
    React.useState<InMemoryTemporaryIdentity>({
      value: "",
      type: identity ? identity.type : IdentityTypes.EMAIL,
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
          {!identity ? (
            <SkeletonTextLine fontSize={1.6} width={50} />
          ) : (
            <p>{identity.value}</p>
          )}
        </Value>
      </Box>
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : null}
      {identity ? (
        <>
          <Form
            formID={formID}
            onSubmit={async () => {
              const body = {
                callbackUrl: "/",
                identityInput: modifiedIdentity,
                identityToUpdateId: identity.id,
              };

              await fetchJson(
                "/api/auth-connect/send-identity-validation-code",
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
                      formatErrorMessage(
                        router.locale || "en",
                        "somethingWrong",
                      ),
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
                      `/account/logins/${identity.type}/validation/${parsedResponse.eventId}`,
                    );
                }
              });
            }}
          >
            {getIdentityType(identity.type) === IdentityTypes.EMAIL ? (
              <InputText
                type="text"
                name="value"
                placeholder={`Enter your ${identity.type}`}
                value={modifiedIdentity.value}
                onChange={(value) =>
                  setIdentity({
                    value,
                    type: identity.type,
                    expiresAt: Date.now() + 300000,
                    primary: identity.primary,
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
                  value={modifiedIdentity.value}
                  defaultCountry="FR"
                  onChange={(value) => {
                    setIdentity({
                      value,
                      type: identity.type,
                      expiresAt: Date.now() + 300000,
                      primary: modifiedIdentity.primary,
                    });
                  }}
                />
              </>
            )}
            <Button type="submit" variant={ButtonVariant.PRIMARY}>
              Update {identity.type}
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
  word-break: break-all;
`;

export { UpdateIdentityForm };
