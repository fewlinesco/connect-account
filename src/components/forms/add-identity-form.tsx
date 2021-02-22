import "react-phone-number-input/style.css";
import { IdentityTypes } from "@fewlines/connect-management";
import { useRouter } from "next/router";
import React from "react";
import PhoneInput from "react-phone-number-input";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Form } from "./form";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { Input } from "@src/components/input/input";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { getIdentityType } from "@src/utils/get-identity-type";
import { addIdentity } from "@src/workflows/add-identity";

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
          await addIdentity(identity).then((response) => {
            if ("message" in response) {
              setFormID(uuidv4());
              setErrorMessage(response.message);
            }

            if ("eventId" in response) {
              router &&
                router.push(
                  `/account/logins/${type}/validation/${response.eventId}`,
                );
            }
          });
        }}
      >
        <p>
          {getIdentityType(type) === IdentityTypes.PHONE
            ? "phone number *"
            : "email address *"}
        </p>
        {getIdentityType(type) === IdentityTypes.EMAIL ? (
          <Input
            type="email"
            name="value"
            placeholder="Enter your email"
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
        ) : (
          <StyledPhoneInput
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
        )}
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

const StyledPhoneInput = styled(PhoneInput)`
  margin: ${({ theme }) => theme.spaces.xs} 0;

  .PhoneInputInput {
    width: 100%;
    height: 4rem;
    padding-left: 1.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
    border-radius: ${({ theme }) => theme.radii[0]};

    ::placeholder {
      color: ${({ theme }) => theme.colors.lightGrey};
      font-size: ${({ theme }) => theme.fontSizes.s};
    }
  }
`;

export { AddIdentityForm };
