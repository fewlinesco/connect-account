import React from "react";

import { StoriesContainer } from "../../../containers/stories-container";
import { StandardIdentitiesSection } from "./StandardIdentitiesSection";
import { Identity, IdentityTypes } from "@lib/@types";

export default {
  title: "components/Standard Identity Section",
  component: StandardIdentitiesSection,
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

  return (
    <StoriesContainer>
      <StandardIdentitiesSection
        sectionName={"EMAIL"}
        content={{
          title: "Email addresses",
          noIdentityMessage: "No email added yet.",
          addNewIdentityMessage: "add new email address",
        }}
        identitiesList={emailIdentities}
      />
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

  return (
    <StoriesContainer>
      <StandardIdentitiesSection
        sectionName={"PHONE"}
        content={{
          title: "Phone numbers",
          noIdentityMessage: "No phone number added yet.",
          addNewIdentityMessage: "add new phone number",
        }}
        identitiesList={phoneIdentities}
      />
    </StoriesContainer>
  );
};
