import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../input/input-text";
// import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { Profile } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";

type ProfileNames = Pick<
  Profile,
  "name" | "family_name" | "given_name" | "middle_name"
>;

const UpdateNamesForm: React.FC<{ profileNames?: ProfileNames }> = ({
  profileNames,
}) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  // const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [
    updatedProfileNames,
    setupdatedProfileNames,
  ] = React.useState<ProfileNames>({
    name: profileNames ? profileNames.name : "",
    family_name: profileNames ? profileNames.family_name : "",
    given_name: profileNames ? profileNames.given_name : "",
    middle_name: profileNames ? profileNames.middle_name : "",
  });

  return (
    <>
      {/* {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null} */}
      <Form
        formID={formID}
        onSubmit={async () => {
          setFormID(uuidv4());
          return;
        }}
      >
        <InputText
          type="text"
          name="value"
          placeholder="First name"
          value={updatedProfileNames.name}
          onChange={(value) => {
            setupdatedProfileNames({
              ...updatedProfileNames,
              name: value,
            });
          }}
          label="First name *"
        />
        <InputText
          type="text"
          name="value"
          placeholder="Last name"
          value={updatedProfileNames.family_name}
          onChange={(value) => {
            setupdatedProfileNames({
              ...updatedProfileNames,
              family_name: value,
            });
          }}
          label="Last name *"
        />
        <InputText
          type="text"
          name="value"
          placeholder="Given name"
          value={updatedProfileNames.given_name}
          onChange={(value) => {
            setupdatedProfileNames({
              ...updatedProfileNames,
              given_name: value,
            });
          }}
          label="Given name"
        />
        <InputText
          type="text"
          name="value"
          placeholder="Middle name"
          value={updatedProfileNames.middle_name}
          onChange={(value) => {
            setupdatedProfileNames({
              ...updatedProfileNames,
              middle_name: value,
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
