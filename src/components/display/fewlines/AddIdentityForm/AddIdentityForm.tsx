import Link from "next/link";
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
import { getInputFormType } from "@src/utils/getInputFormType";

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
            });
          }}
        />
        <Button
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >{`Add ${type.toLowerCase()}`}</Button>
      </Form>
      <Link href="/account/logins" passHref>
        <NeutralLink>
          <Button variant={ButtonVariant.SECONDARY}>Cancel</Button>
        </NeutralLink>
      </Link>
    </>
  );
};

const WrongInputError = styled.p`
  color: ${({ theme }) => theme.colors.red};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 3rem;
`;
