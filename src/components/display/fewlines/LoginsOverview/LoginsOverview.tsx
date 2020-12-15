import React from "react";
import styled from "styled-components";

import { IdentitiesSection } from "../IdentitiesSection/IdentitiesSection";
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

  const IDENTITIES_SECTION_CONTENT = {
    EMAIL: {
      title: "Email addresses",
      noIdentityMessage: "No email added yet.",
      addNewIdentityMessage: "add new email address",
      identitiesList: emailIdentities,
    },
    PHONE: {
      title: "Phone numbers",
      noIdentityMessage: "No phone number added yet.",
      addNewIdentityMessage: "add new phone number",
      identitiesList: phoneIdentities,
    },
    SOCIAL_LOGINS: {
      title: "Social logins",
      noIdentityMessage: "No social logins added yet.",
      identitiesList: socialIdentities,
    },
  };

  const identitiesSectionList = Object.entries(IDENTITIES_SECTION_CONTENT);

  return (
    <Container>
      {identitiesSectionList.map(([sectionName, content], index) => {
        const lastOfTheList = index === identitiesSectionList.length - 1;

        return (
          <IdentitiesSection
            key={sectionName}
            sectionName={sectionName}
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
