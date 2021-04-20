import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../input/input-text";
import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";

type ProfileNames = {
  firstName: string;
  lastName: string;
  givenName?: string;
  middleName?: string;
};

const UpdateNamesForm: React.FC = () => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [profileNames, setProfileNames] = React.useState<ProfileNames>({
    firstName: "",
    lastName: "",
    givenName: "",
    middleName: "",
  });

  return (
    <>
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          console.log(profileNames);
          setFormID(uuidv4());
          return;
        }}
      >
        <InputText
          type="text"
          name="value"
          placeholder="First name"
          value={profileNames.firstName}
          onChange={(value) => {
            setProfileNames({
              ...profileNames,
              firstName: value,
            });
          }}
          label="First name *"
        />
        <InputText
          type="text"
          name="value"
          placeholder="Last name"
          value={profileNames.lastName}
          onChange={(value) => {
            setProfileNames({
              ...profileNames,
              lastName: value,
            });
          }}
          label="Last name *"
        />
        <InputText
          type="text"
          name="value"
          placeholder="Given name"
          value={profileNames.givenName}
          onChange={(value) => {
            setProfileNames({
              ...profileNames,
              givenName: value,
            });
          }}
          label="Given name"
        />
        <InputText
          type="text"
          name="value"
          placeholder="Middle name"
          value={profileNames.middleName}
          onChange={(value) => {
            setProfileNames({
              ...profileNames,
              middleName: value,
            });
          }}
          label="Middle name"
        />
        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          Update names
        </Button>
      </Form>
      <NeutralLink href="/account/logins">
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

export { UpdateNamesForm };
