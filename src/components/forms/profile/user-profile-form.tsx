import { ProfileData } from "connect-profile-client";
import { useRouter } from "next/router";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { InputDatePicker } from "../../input/input-date-picker";
import { InputText } from "../../input/input-text";
import { Form } from "../form";
import { Profile } from "@src/@types/profile";
import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { fetchJson } from "@src/utils/fetch-json";

import "react-datepicker/dist/react-datepicker.css";

const UserProfileForm: React.FC<{
  userProfileData?: Profile;
  isCreation?: boolean;
}> = ({ userProfileData, isCreation }) => {
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
          if (isCreation) {
            await fetchJson("/api/profile/user-profile", "POST", {
              userProfilePayload: userProfile,
            }).then(async (response) => {
              const parsedResponse = await response.json();

              if ("createdUserProfile" in parsedResponse) {
                router && router.push("/account/profile");
                return;
              }

              throw new Error("Something went wrong");
            });
          }

          await fetchJson("/api/profile/user-profile", "PATCH", {
            userProfilePayload: userProfile,
          }).then(async (response) => {
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
          required
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
            if (date !== null) {
              const fullISODate = date.toISOString();
              const formattedISODate = fullISODate.slice(
                0,
                fullISODate.indexOf("T"),
              );
              setUserProfile({ ...userProfile, birthdate: formattedISODate });
            }

            setUserProfile((prevState) => {
              return {
                ...userProfile,
                birthdate: prevState.birthdate,
              };
            });
          }}
        />
        <InputText
          type="text"
          name="profile"
          placeholder="Enter your profile URL"
          value={userProfile.profile}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              profile: value,
            });
          }}
          label="Profile URL"
        />
        <InputText
          type="text"
          name="zoneinfo"
          placeholder="Enter your zone info"
          value={userProfile.zoneinfo}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              zoneinfo: value,
            });
          }}
          label="Zone info"
        />
        <InputText
          type="text"
          name="locale"
          placeholder="Enter your locale"
          value={userProfile.locale}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              locale: value,
            });
          }}
          label="Locale"
        />
        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          {isCreation ? "Add my information" : "Update my information"}
        </Button>
      </Form>
      <NeutralLink href={isCreation ? "/account" : "/account/profile"}>
        <FakeButton variant={ButtonVariant.SECONDARY}>Cancel</FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

export { UserProfileForm };
