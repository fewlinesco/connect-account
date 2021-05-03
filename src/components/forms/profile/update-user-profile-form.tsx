import React from "react";
import { v4 as uuidv4 } from "uuid";
import "react-datepicker/dist/react-datepicker.css";

import { InputDatePicker } from "../../input/input-date-picker";
import { InputText } from "../../input/input-text";
import { Form } from "../form";
import { Profile } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";

const UpdateUserProfileForm: React.FC<{ userProfileData?: Profile }> = ({
  userProfileData,
}) => {
  const [formID, setFormID] = React.useState<string>(uuidv4());

  const [updatedName, setUpdatedName] = React.useState<string>("");
  const [updatedUsername, setUpdatedUsername] = React.useState<string>("");
  const [birthdate, setBirthdate] = React.useState<string>("");

  React.useEffect(() => {
    if (userProfileData) {
      setUpdatedName(
        `${userProfileData.name} ${userProfileData.middle_name} ${userProfileData.family_name}`,
      );
      setUpdatedUsername(userProfileData.preferred_username);
      setBirthdate(userProfileData.birthdate);
    }
  }, [userProfileData]);

  return (
    <>
      <Form
        formID={formID}
        onSubmit={async () => {
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
        <InputDatePicker
          label="Birthdate"
          selected={birthdate !== "" ? birthdate : undefined}
          onChange={(date) => {
            setBirthdate(date.toLocaleDateString("en-EN"));
          }}
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

export { UpdateUserProfileForm };
