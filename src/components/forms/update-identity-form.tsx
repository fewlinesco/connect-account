import { Identity, IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Form } from "./form";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { Box } from "@src/components/box/box";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { Input } from "@src/components/input/input";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { PhoneNumberInputValueShouldBeANumber } from "@src/errors";
import { addIdentity } from "@src/workflows/add-identity";

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
          await addIdentity(identity, currentIdentity.id)
            .then(async (response) => {
              if ("message" in response) {
                setFormID(uuidv4());
                setErrorMessage(response.message);
              }
              if ("eventId" in response) {
                router &&
                  router.push(
                    `/account/logins/${currentIdentity.type}/validation/${response.eventId}`,
                  );
              }
            })
            .catch((error) => {
              if (error instanceof PhoneNumberInputValueShouldBeANumber) {
                setFormID(uuidv4());
                setErrorMessage(error.message);
              } else {
                throw error;
              }
            });
        }}
      >
        <p>
          New{" "}
          {currentIdentity.type === IdentityTypes.PHONE
            ? "phone number"
            : "email address"}{" "}
          *
        </p>
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

const WrongInputError = styled.p`
  color: ${({ theme }) => theme.colors.red};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 3rem;
`;

export { UpdateIdentityForm };
