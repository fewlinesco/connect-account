import { HttpStatus } from "@fwl/web";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";
import { useSWRConfig } from "swr";
import { ScopedMutator } from "swr/dist/types";
import { v4 as uuidv4 } from "uuid";

import { Form } from "../form";
import { Profile } from "@src/@types/profile";
import { Button } from "@src/components/buttons";
import { InputDayPicker } from "@src/components/input/input-date-picker/day-picker";
import { InputText } from "@src/components/input/input-text/input-text";
import { NeutralLink } from "@src/components/neutral-link";
import { fetchJson } from "@src/utils/fetch-json";
import { ProfileData } from "connect-profile-client";

type ProfilePayload = Omit<Profile, "id" | "sub" | "updated_at">;

async function updateOrCreateProfile(
  router: NextRouter,
  mutate: ScopedMutator,
  profilePayload: ProfilePayload,
  isCreation?: boolean,
): Promise<void> {
  const url = "/api/profile/user-profile/";
  const method = isCreation ? "POST" : "PATCH";

  return fetchJson(url, method, profilePayload).then(async (response) => {
    const parsedResponse = await response.json();

    if (
      response.status === HttpStatus.CREATED ||
      response.status === HttpStatus.OK
    ) {
      mutate("/api/profile/user-profile/", parsedResponse);
      router && router.push("/account/profile/");
      return;
    } else {
      throw new Error("Something went wrong");
    }
  });
}

const UserProfileForm: React.FC<{
  isValidating: boolean;
  userProfileData?: Profile;
  isCreation?: boolean;
}> = ({ userProfileData, isCreation, isValidating }) => {
  const { formatMessage } = useIntl();
  const { mutate } = useSWRConfig();

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
          await updateOrCreateProfile(
            router,
            mutate,
            userProfile as ProfilePayload,
            isCreation,
          );
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
        <InputDayPicker
          isValidating={isValidating}
          label={formatMessage({ id: "birthDateLabel" })}
          locale={router.locale}
          date={new Date(userProfile.birthdate || Date.now())}
          onDayChange={(date) => {
            const ISODate = date.toISOString();
            const formattedISODate = ISODate.slice(0, ISODate.indexOf("T"));

            setUserProfile({
              ...userProfile,
              birthdate: formattedISODate,
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
        <Button type="submit" className="btn btn-primary">
          {isCreation
            ? formatMessage({ id: "add" })
            : formatMessage({ id: "update" })}
        </Button>
      </Form>
      <NeutralLink href={isCreation ? "/account/" : "/account/profile/"}>
        <div className="btn btn-secondary btn-neutral-link">
          {formatMessage({ id: "cancel" })}
        </div>
      </NeutralLink>{" "}
    </>
  );
};

export { UserProfileForm };
