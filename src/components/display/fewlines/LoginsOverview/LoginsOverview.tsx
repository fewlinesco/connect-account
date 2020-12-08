import React from "react";
import styled from "styled-components";

import { IdentitySection } from "../IdentitySection/IdentitySection";
import { IdentityTypes } from "@lib/@types/Identity";
import { SortedIdentities } from "@src/@types/SortedIdentities";

type LoginsOverviewProps = {
  sortedIdentities: SortedIdentities;
};

export const LoginsOverview: React.FC<LoginsOverviewProps> = ({
  sortedIdentities,
}) => {
  const {
    emailIdentities,
    phoneIdentities,
    socialIdentities,
  } = sortedIdentities;

  const IDENTITY_SECTION_CONTENT = {
    EMAIL: {
      title: "Email Addresses",
      identityType: IdentityTypes.EMAIL,
      identitiesList: emailIdentities,
      noIdentityMessage: "No email added yet.",
      addNewIdentityMessage: "add new email address",
    },
    PHONE: {
      title: "Phone numbers",
      identityType: IdentityTypes.PHONE,
      identitiesList: phoneIdentities,
      noIdentityMessage: "No phone number added yet.",
      addNewIdentityMessage: "add new phone number",
    },
    SOCIAL_LOGINS: {
      title: "Social logins",
      identitiesList: socialIdentities,
      noIdentityMessage: "No social logins added yet.",
    },
  };

  const identitySectionList = Object.entries(IDENTITY_SECTION_CONTENT);

  return (
    <Container>
      {identitySectionList.map(([sectionName, content], index) => {
        const lastOfTheList = index === identitySectionList.length - 1;

        return (
          <IdentitySection
            key={sectionName}
            content={content}
            lastOfTheList={lastOfTheList}
          />
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  margin: 0 0 10rem 0;
`;
