import "react-phone-number-input/style.css";

import { Identity } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { InputsRadio } from "../input/input-radio-button";
import { Form } from "./form";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";

const TwoFAForm: React.FC<{
  primaryIdentities: Identity[];
}> = ({ primaryIdentities }) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [selectedIdentity, setSelectedIdentity] = React.useState<Identity>(
    primaryIdentities[0],
  );

  const inputsValues = primaryIdentities.map((identity) => identity.value);

  return (
    <ContactChoiceForm
      formID={formID}
      onSubmit={async () => {
        setFormID(uuidv4());
        return;
      }}
    >
      <p>
        Chose a contact address below that we’ll send a confirmation code to:
      </p>
      <InputsRadio
        groupName="contactChoice"
        inputsValues={inputsValues}
        selectedInput={selectedIdentity.value}
        onChange={({ target }) => {
          const newIdentity = primaryIdentities.find(
            (identity) => identity.value === target.value,
          );

          if (newIdentity) {
            setSelectedIdentity(newIdentity);
          }
        }}
      />
      <Button variant={ButtonVariant.PRIMARY} type="submit">
        Send confirmation code
      </Button>
    </ContactChoiceForm>
  );
};

const ContactChoiceForm = styled(Form)`
  padding: ${({ theme }) => theme.spaces.xs} 0;

  p {
    padding-bottom: ${({ theme }) => theme.spaces.xs};
    padding-left: ${({ theme }) => theme.spaces.xs};
  }

  button {
    margin-top: ${({ theme }) => theme.spaces.xs};
  }
`;

export { TwoFAForm };
