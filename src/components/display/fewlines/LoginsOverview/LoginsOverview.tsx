import React from "react";
import styled from "styled-components";

import { IdentitiesSection } from "../IdentitiesSection/IdentitiesSection";
import { Identity } from "@lib/@types";
import { SortedIdentities } from "@src/@types/SortedIdentities";

type LoginsOverviewProps = {
  sortedIdentities: SortedIdentities;
};

const IDENTITIES_SECTION_CONTENT = {
  EMAIL: {
    title: "Email addresses",
    noIdentityMessage: "No email added yet.",
    addNewIdentityMessage: "add new email address",
  },
  PHONE: {
    title: "Phone numbers",
    noIdentityMessage: "No phone number added yet.",
    addNewIdentityMessage: "add new phone number",
  },
  SOCIAL_LOGINS: {
    title: "Social logins",
    noIdentityMessage: "No social logins added yet.",
  },
};

export const LoginsOverview: React.FC<LoginsOverviewProps> = ({
  sortedIdentities,
}) => {
  const {
    emailIdentities,
    phoneIdentities,
    socialIdentities,
  } = sortedIdentities;

  const identitiesSectionList = Object.entries(IDENTITIES_SECTION_CONTENT);

  return (
    <Container>
      {identitiesSectionList.map(([sectionName, content], index) => {
        const lastOfTheList = index === identitiesSectionList.length - 1;
        let identitiesList: Identity[] = [];

        switch (sectionName) {
          case "EMAIL":
            identitiesList = emailIdentities;
            break;
          case "PHONE":
            identitiesList = phoneIdentities;
            break;
          case "SOCIAL_LOGINS":
            identitiesList = socialIdentities;
            break;
          default:
            null;
        }

        return (
          <IdentitiesSection
            key={sectionName}
            sectionName={sectionName}
            content={content}
            identitiesList={identitiesList}
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
