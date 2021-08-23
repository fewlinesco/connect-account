import { IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { FormErrorMessage } from "../../input/form-error-message";
import { InputText } from "../../input/input-text";
import { Form } from "../form";
import { Box } from "@src/components/boxes";
import { Button } from "@src/components/buttons";
import { NeutralLink } from "@src/components/neutral-link";
import { formatErrorMessage } from "@src/configs/intl";
import { ERRORS_DATA } from "@src/errors/web-errors";
import { fetchJson } from "@src/utils/fetch-json";
import { formatSnakeCaseToCamelCase } from "@src/utils/format";

const ValidateIdentityForm: React.FC<{
  type: IdentityTypes;
  eventId: string;
}> = ({ type, eventId }) => {
  const [validationCode, setValidationCode] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [formID, setFormID] = React.useState<string>(uuidv4());

  const router = useRouter();

  return (
    <>
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      ) : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          await fetchJson("/api/auth-connect/verify-validation-code/", "POST", {
            validationCode,
            eventId,
          }).then(async (response) => {
            if (response.status >= 400) {
              const parsedResponse = await response.json();

              if ("code" in parsedResponse) {
                if (
                  parsedResponse.code ===
                    ERRORS_DATA.INVALID_VALIDATION_CODE.code ||
                  parsedResponse.code === ERRORS_DATA.INVALID_BODY.code
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

                if (
                  parsedResponse.code ===
                  ERRORS_DATA.TEMPORARY_IDENTITY_EXPIRED.code
                ) {
                  router && router.push("/account/logins/email/new/");
                  return;
                }
              }
            }

            router && router.push("/account/logins/");
          });
        }}
      >
        <Box>
          <Value>Enter the validation code below</Value>
        </Box>
        <InputText
          type="text"
          name="value"
          placeholder="012345"
          autoFocus={true}
          value={validationCode}
          onChange={(value) => setValidationCode(value)}
          label="Validation code"
        />
        <Button
          type="submit"
          className="btn btn-primary"
        >{`Confirm ${type.toLowerCase()}`}</Button>
      </Form>
      <NeutralLink href="/account/logins/">
        <div className="btn btn-secondary btn-neutral-link">
          Discard all changes
        </div>
      </NeutralLink>
      <DidntReceiveCode>Didn&apos;t receive code?</DidntReceiveCode>
      <Button
        type="button"
        className="btn btn-secondary"
        onPress={async () => {
          await fetchJson(
            "/api/auth-connect/re-send-identity-validation-code/",
            "POST",
            { eventId },
          )
            .then(async (response) => await response.json())
            .then(({ eventId }) =>
              router.push(`/account/logins/${type}/validation/${eventId}/`),
            );
        }}
      >
        Resend validation code
      </Button>
    </>
  );
};

const DidntReceiveCode = styled.p`
  margin: ${({ theme }) => theme.spaces.s} 0 ${({ theme }) => theme.spaces.xs};
`;

const Value = styled.p`
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: ${({ theme }) => theme.fontSizes.s};
`;

export { ValidateIdentityForm };
