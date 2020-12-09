import React from "react";

import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { Separator } from "../Separator/Separator";
import { BoxedLink, IdentitySection } from "./IdentitySection";
import { Identity, IdentityTypes } from "@lib/@types";

export default {
  title: "components/Identity Section",
  component: IdentitySection,
};

const displayStandardIdentityList = (
  identity: Identity,
  index: number,
  listLength: number,
): JSX.Element => {
  return (
    <div key={identity.type + index}>
      <BoxedLink
        primary={identity.primary}
        status={identity.status}
        href={{
          pathname: "/account/logins/[type]/[id]",
          query: {
            type: identity.type.toLowerCase(),
            id: identity.id,
          },
        }}
      >
        <p>{identity.value}</p>
        <RightChevron />
      </BoxedLink>
      {index < listLength && <Separator />}
    </div>
  );
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
        displayListMethod: displayStandardIdentityList,
        noIdentityMessage: "No email added yet.",
        addNewIdentityMessage: "add new email address",
      }}
      lastOfTheList={false}
    />
  );
};
