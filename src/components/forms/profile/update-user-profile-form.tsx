import { ProfileData } from "connect-profile-client";
import { useRouter } from "next/router";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputDatePicker } from "../../input/input-date-picker";
import { InputText } from "../../input/input-text";
import { Form } from "../form";
import { HttpVerbs } from "@src/@types/http-verbs";
import { Profile } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { fetchJson } from "@src/utils/fetch-json";

import "react-datepicker/dist/react-datepicker.css";

const UpdateUserProfileForm: React.FC<{ userProfileData?: Profile }> = ({
  userProfileData,
}) => {
  const [formID] = React.useState<string>(uuidv4());

  const [userProfile, setUserProfile] = React.useState<ProfileData>({
    name: "",
    family_name: "",
    given_name: "",
    middle_name: "",
    nickname: "",
    preferred_username: "",
    profile: "",
    picture: "",
    website: "",
    gender: "",
    birthdate: "",
    zoneinfo: "",
    locale: "",
  });

  const router = useRouter();

  React.useEffect(() => {
    if (userProfileData) {
      setUserProfile(userProfileData);
    }
  }, [userProfileData]);

  return (
    <>
      <Form
        formID={formID}
        onSubmit={async () => {
          const body = {
            userProfilePayload: userProfile,
          };

          await fetchJson(
            "/api/profile/user-profile",
            HttpVerbs.PATCH,
            body,
          ).then(async (response) => {
            const parsedResponse = await response.json();

            if ("updatedUserProfile" in parsedResponse) {
              router && router.push("/account/profile");
              return;
            }

            throw new Error("Something went wrong");
          });
        }}
      >
        <InputText
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={userProfile.name}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              name: value,
            });
          }}
          label="Name *"
        />
        <InputText
          type="text"
          name="username"
          placeholder="Enter your username"
          value={userProfile.preferred_username}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              preferred_username: value,
            });
          }}
          label="Username"
        />
        <InputDatePicker
          label="Birthdate"
          selected={
            userProfile.birthdate !== "" ? userProfile.birthdate : undefined
          }
          onChange={(date) => {
            setUserProfile({
              ...userProfile,
              birthdate: date.toLocaleDateString("en-EN"),
            });
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
