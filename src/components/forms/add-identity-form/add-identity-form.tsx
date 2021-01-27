import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Form } from "../form";
import { IdentityTypes } from "@lib/@types";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { PhoneNumberInputValueShouldBeANumber } from "@src/client-errors";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { Input } from "@src/components/input/input";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { getIdentityType } from "@src/utils/get-identity-type";
import { addIdentity } from "@src/workflows/add-identity";

export const AddIdentityForm: React.FC<{
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
          await addIdentity(identity)
            .then(({ eventId, errorMessage }) => {
              if (errorMessage) {
                setFormID(uuidv4());
                setErrorMessage(errorMessage);
              }

              if (eventId) {
                router &&
                  router.push(`/account/logins/${type}/validation/${eventId}`);
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
          {getIdentityType(type) === IdentityTypes.PHONE
            ? "phone number"
            : "email address"}{" "}
          *
        </p>
        <Input
          type={
            getIdentityType(type) === IdentityTypes.EMAIL ? "email" : "text"
          }
          name="value"
          placeholder={`Enter your ${type.toLowerCase()}`}
          value={identity.value}
          onChange={(event) => {
            setIdentity({
              value: event.target.value,
              type,
              expiresAt: Date.now() + 300000,
              primary: identity.primary,
            });
          }}
        />

        <Label>
          <Input
            type="checkbox"
            name="primary"
            onChange={() => {
              setIdentity({
                ...identity,
                primary: !identity.primary,
              });
            }}
          />
          Mark this identity as my primary one
        </Label>

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

const WrongInputError = styled.p`
  color: ${({ theme }) => theme.colors.red};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 3rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spaces.xs};
  cursor: pointer;
`;
