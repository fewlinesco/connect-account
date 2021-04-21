import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputText } from "../input/input-text";
// import { WrongInputError } from "../input/wrong-input-error";
import { Form } from "./form";
import { Profile } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";

const UpdateUserInfoForm: React.FC<{ profileData?: Profile }> = ({
  profileData,
}) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());
  // const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [updatedName, setUpdatedName] = React.useState<string>("");
  const [updatedUsername, setUpdatedUsername] = React.useState<string>("");

  React.useEffect(() => {
    if (profileData) {
      setUpdatedName(
        `${profileData.name} ${profileData.middle_name} ${profileData.family_name}`,
      );
      setUpdatedUsername(profileData.preferred_username);
    }
  }, [profileData]);

  return (
    <>
      {/* {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null} */}
      <Form
        formID={formID}
        onSubmit={async () => {
          console.log(updatedUsername);
          setFormID(uuidv4());
          return;
        }}
      >
        <InputText
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={updatedName}
          onChange={(value) => {
            setUpdatedName(value);
          }}
          label="Name *"
        />

        <InputText
          type="text"
          name="username"
          placeholder="Enter your username"
          value={updatedUsername}
          onChange={(value) => {
            setUpdatedUsername(value);
          }}
          label="Username"
        />

        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          Update my information
        </Button>
      </Form>
      <NeutralLink href="/account/logins">
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

export { UpdateUserInfoForm };
