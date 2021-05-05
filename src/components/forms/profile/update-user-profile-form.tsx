import { useRouter } from "next/router";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import "react-datepicker/dist/react-datepicker.css";

import { InputDatePicker } from "../../input/input-date-picker";
import { InputText } from "../../input/input-text";
import { Form } from "../form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { Profile } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { fetchJson } from "@src/utils/fetch-json";

const UpdateUserProfileForm: React.FC<{ userProfileData?: Profile }> = ({
  userProfileData,
}) => {
  const [formID] = React.useState<string>(uuidv4());

  const [name, setName] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [birthdate, setBirthdate] = React.useState<string>("");

  const router = useRouter();

  React.useEffect(() => {
    if (userProfileData) {
      setName(
        `${userProfileData.name} ${userProfileData.middle_name} ${userProfileData.family_name}`,
      );
      setUsername(userProfileData.preferred_username);
      setBirthdate(userProfileData.birthdate);
    }
  }, [userProfileData]);

  return (
    <>
      <Form
        formID={formID}
        onSubmit={async () => {
          const body = {
            userProfilePayload: {
              name,
              preferred_username: username,
              birthdate,
            },
          };

          await fetchJson(
            "/api/profile/user-profile",
            HttpVerbs.PATCH,
            body,
          ).then(async (response) => {
            const parsedResponse = await response.json();

            if ("updatedUserProfile" in parsedResponse) {
              router && router.push("/account/logins/profile");
            }

            throw new Error("Something went wrong");
          });
        }}
      >
        <InputText
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={name}
          onChange={(value) => {
            setName(value);
          }}
          label="Name *"
        />
        <InputText
          type="text"
          name="username"
          placeholder="Enter your username"
          value={username}
          onChange={(value) => {
            setUsername(value);
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
