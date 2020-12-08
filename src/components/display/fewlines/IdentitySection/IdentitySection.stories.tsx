import React from "react";

import { IdentitySection } from "./IdentitySection";
import { IdentityTypes } from "@lib/@types";

export default {
  title: "components/Identity Section",
  component: IdentitySection,
};

export const EmailIdentitySection = (): JSX.Element => {
  return (
    <IdentitySection
      content={{
        title: "Email Addresses",
        identityType: IdentityTypes.EMAIL,
        identitiesList: [
          {
            id: "hello",
            primary: true,
            status: "validated",
            type: IdentityTypes.EMAIL,
            value: "test@test.test",
          },
        ],
        noIdentityMessage: "No email added yet.",
        addNewIdentityMessage: "add new email address",
      }}
      lastOfTheList={false}
    />
  );
};
