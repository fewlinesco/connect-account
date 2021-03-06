import { ProfileData } from "connect-profile-client";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
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
  const { formatMessage } = useIntl();
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
            return fetchJson("/api/profile/user-profile", "POST", {
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

          return fetchJson("/api/profile/user-profile", "PATCH", {
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
          placeholder={formatMessage({ id: "namePlaceholder" })}
          value={userProfile.name}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              name: value,
            });
          }}
          label={formatMessage({ id: "nameLabel" })}
          required
        />
        <InputText
          type="text"
          name="username"
          placeholder={formatMessage({ id: "usernamePlaceholder" })}
          value={userProfile.preferred_username}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              preferred_username: value,
            });
          }}
          label={formatMessage({ id: "usernameLabel" })}
        />
        <InputDatePicker
          label={formatMessage({ id: "birthDateLabel" })}
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
          placeholder={formatMessage({ id: "profilePlaceholder" })}
          value={userProfile.profile}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              profile: value,
            });
          }}
          label={formatMessage({ id: "profileLabel" })}
        />
        <InputText
          type="text"
          name="website"
          placeholder={formatMessage({ id: "websitePlaceholder" })}
          value={userProfile.website}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              website: value,
            });
          }}
          label={formatMessage({ id: "websiteLabel" })}
        />
        <InputText
          type="text"
          name="picture"
          placeholder={formatMessage({ id: "picturePlaceholder" })}
          value={userProfile.picture}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              picture: value,
            });
          }}
          label={formatMessage({ id: "pictureLabel" })}
        />
        <InputText
          type="text"
          name="zoneinfo"
          placeholder={formatMessage({ id: "zoneInfoPlaceholder" })}
          value={userProfile.zoneinfo}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              zoneinfo: value,
            });
          }}
          label={formatMessage({ id: "zoneInfoLabel" })}
        />
        <InputText
          type="text"
          name="locale"
          placeholder={formatMessage({ id: "localePlaceholder" })}
          value={userProfile.locale}
          onChange={(value) => {
            setUserProfile({
              ...userProfile,
              locale: value,
            });
          }}
          label={formatMessage({ id: "localeLabel" })}
        />
        <Button type="submit" variant={ButtonVariant.PRIMARY}>
          {isCreation
            ? formatMessage({ id: "add" })
            : formatMessage({ id: "update" })}
        </Button>
      </Form>
      <NeutralLink href={isCreation ? "/account" : "/account/profile"}>
        <FakeButton variant={ButtonVariant.SECONDARY}>
          {formatMessage({ id: "cancel" })}
        </FakeButton>
      </NeutralLink>{" "}
    </>
  );
};

export { UserProfileForm };
