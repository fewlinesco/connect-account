import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { IdentitiesSection } from "./IdentitiesSection";
import { Identity, IdentityTypes } from "@lib/@types";

export default {
  title: "components/Identity Section",
  component: IdentitiesSection,
};

export const EmailIdentitiesSection = (): JSX.Element => {
  const emailIdentities: Identity[] = [
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: IdentityTypes.EMAIL,
      value: "test@test.test",
    },
    {
      id: "66tedcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "validated",
      type: IdentityTypes.EMAIL,
      value: "test2@test.test",
    },
  ];

  const IDENTITIES_SECTION_CONTENT = {
    EMAIL: {
      title: "Email addresses",
      noIdentityMessage: "No email added yet.",
      addNewIdentityMessage: "add new email address",
      identitiesList: emailIdentities,
    },
  };

  const identitiesSectionList = Object.entries(IDENTITIES_SECTION_CONTENT);

  return (
    <StoriesContainer>
      {identitiesSectionList.map(([sectionName, content]) => {
        return (
          <IdentitiesSection
            key={sectionName}
            sectionName={sectionName}
            content={content}
            lastOfTheList={false}
          />
        );
      })}
    </StoriesContainer>
  );
};

export const PhoneIdentitiesSection = (): JSX.Element => {
  const phoneIdentities: Identity[] = [
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: IdentityTypes.PHONE,
      value: "0622116655",
    },
    {
      id: "7y6edcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "validated",
      type: IdentityTypes.PHONE,
      value: "0622116688",
    },
  ];

  const IDENTITIES_SECTION_CONTENT = {
    PHONE: {
      title: "Phone numbers",
      noIdentityMessage: "No phone number added yet.",
      addNewIdentityMessage: "add new phone number",
      identitiesList: phoneIdentities,
    },
  };

  const identitiesSectionList = Object.entries(IDENTITIES_SECTION_CONTENT);

  return (
    <StoriesContainer>
      {identitiesSectionList.map(([sectionName, content]) => {
        return (
          <IdentitiesSection
            key={sectionName}
            sectionName={sectionName}
            content={content}
            lastOfTheList={false}
          />
        );
      })}
    </StoriesContainer>
  );
};

export const SocialLoginsIdentitiesSection = (): JSX.Element => {
  const socialIdentities: Identity[] = [
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: IdentityTypes.GITHUB,
      value: "",
    },
    {
      id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "validated",
      type: IdentityTypes.FACEBOOK,
      value: "",
    },
  ];

  const IDENTITIES_SECTION_CONTENT = {
    SOCIAL_LOGINS: {
      title: "Social logins",
      noIdentityMessage: "No social logins added yet.",
      identitiesList: socialIdentities,
    },
  };

  const identitiesSectionList = Object.entries(IDENTITIES_SECTION_CONTENT);

  return (
    <StoriesContainer>
      {identitiesSectionList.map(([sectionName, content]) => {
        return (
          <IdentitiesSection
            key={sectionName}
            sectionName={sectionName}
            content={content}
            lastOfTheList={false}
          />
        );
      })}
    </StoriesContainer>
  );
};
