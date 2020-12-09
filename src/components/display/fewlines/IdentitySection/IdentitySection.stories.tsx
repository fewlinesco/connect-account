import React from "react";

import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { IdentityValue } from "../LoginsOverview/LoginsOverview";
import { IdentitySection } from "./IdentitySection";
import { Identity, IdentityTypes } from "@lib/@types";

export default {
  title: "components/Identity Section",
  component: IdentitySection,
};

const displayStandardIdentityList = (identity: Identity): JSX.Element => {
  return (
    <>
      <IdentityValue primary={identity.primary} status={identity.status}>
        {identity.value}
      </IdentityValue>
      <RightChevron />
    </>
  );
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
        displayListMethod: displayStandardIdentityList,
        disableClick: false,
        noIdentityMessage: "No email added yet.",
        addNewIdentityMessage: "add new email address",
        hideSecondaryByDefault: true,
      }}
      lastOfTheList={false}
    />
  );
};
