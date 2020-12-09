import React from "react";

import { IdentitySection } from "./IdentitySection";
import { IdentityTypes } from "@lib/@types";
import { displayIdentity } from "@src/utils/displayIdentity";

export default {
  title: "components/Identity Section",
  component: IdentitySection,
};

export const EmailIdentitySection = (): JSX.Element => {
  return (
    <IdentitySection
      sectionName={"EMAIL"}
      content={{
        title: "Email Addresses",
        identitiesList: [
          {
            id: "hello",
            primary: true,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "test@test.test",
          },
        ],
        displayListMethod: displayIdentity,
        disableClick: false,
        noIdentityMessage: "No email added yet.",
        addNewIdentityMessage: "add new email address",
        hideSecondaryByDefault: true,
      }}
      lastOfTheList={false}
    />
  );
};
