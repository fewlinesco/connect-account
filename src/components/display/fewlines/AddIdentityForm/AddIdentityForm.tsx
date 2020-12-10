import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Button, ButtonVariant } from "../Button/Button";
import { Form } from "../Form/Form";
import { Input } from "../Input/Input";
import { NeutralLink } from "../NeutralLink";
import { IdentityTypes } from "@lib/@types";
import { InMemoryTemporaryIdentity } from "@src/@types/TemporaryIdentity";
import { useAddIdentity } from "@src/hooks/useAddIdentity";
import { getIdentityType } from "@src/utils/getIdentityType";

type AddIdentityFormProps = {
  type: IdentityTypes;
};

export const AddIdentityForm: React.FC<AddIdentityFormProps> = ({ type }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [identity, setIdentity] = React.useState<InMemoryTemporaryIdentity>({
    value: "",
    type,
    expiresAt: Date.now(),
  });

  const { errorMessage, addIdentity } = useAddIdentity();

  return (
    <>
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          await addIdentity(identity).then(() => {
            if (errorMessage) {
              setFormID(uuidv4());
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
