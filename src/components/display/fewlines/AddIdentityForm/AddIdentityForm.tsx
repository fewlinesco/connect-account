import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Button, ButtonVariant } from "../Button/Button";
import { Form } from "../Form/Form";
import { Input } from "../Input/Input";
import { NeutralLink } from "../NeutralLink";
import { IdentityTypes } from "@lib/@types";
import { InMemoryTemporaryIdentity } from "@src/@types/TemporaryIdentity";
import {
  IdentityAlreadyUsed,
  IdentityInputValueCantBeBlank,
  PhoneNumberInputValueShouldBeANumber,
} from "@src/clientErrors";
import { getIdentityType } from "@src/utils/getIdentityType";

type AddIdentityFormProps = {
  type: IdentityTypes;
  addIdentity: (identity: InMemoryTemporaryIdentity) => Promise<void>;
};

export const AddIdentityForm: React.FC<AddIdentityFormProps> = ({
  type,
  addIdentity,
}) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [flashMessage, setFlashMessage] = React.useState<string>("");
  const [identity, setIdentity] = React.useState<InMemoryTemporaryIdentity>({
    value: "",
    type,
    expiresAt: Date.now(),
    primary: false,
  });

  return (
    <>
      {flashMessage ? <WrongInputError>{flashMessage}.</WrongInputError> : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          await addIdentity(identity).catch((error) => {
            if (error instanceof IdentityAlreadyUsed) {
              setFormID(uuidv4());
              setFlashMessage(error.message);
            } else if (error instanceof IdentityInputValueCantBeBlank) {
              setFormID(uuidv4());
              setFlashMessage(error.message);
            } else if (error instanceof PhoneNumberInputValueShouldBeANumber) {
              setFormID(uuidv4());
              setFlashMessage(error.message);
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
              expiresAt: Date.now() + 300,
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
        <Button variant={ButtonVariant.SECONDARY}>Cancel</Button>
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
