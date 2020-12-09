import React from "react";
import styled from "styled-components";

import { IdentitySection } from "../IdentitySection/IdentitySection";
import { SortedIdentities } from "@src/@types/SortedIdentities";
import { displayIdentity } from "@src/utils/displayIdentity";
import { displaySocialLogins } from "@src/utils/displaySocialLogins";

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
      title: "Email addresses",
      identitiesList: emailIdentities,
      displayListMethod: displayIdentity,
      disableClick: false,
      noIdentityMessage: "No email added yet.",
      addNewIdentityMessage: "add new email address",
      hideSecondaryByDefault: true,
    },
    PHONE: {
      title: "Phone numbers",
      identitiesList: phoneIdentities,
      displayListMethod: displayIdentity,
      disableClick: false,
      noIdentityMessage: "No phone number added yet.",
      addNewIdentityMessage: "add new phone number",
      hideSecondaryByDefault: true,
    },
    SOCIAL_LOGINS: {
      title: "Social logins",
      identitiesList: socialIdentities,
      displayListMethod: displaySocialLogins,
      disableClick: true,
      noIdentityMessage: "No social logins added yet.",
      hideSecondaryByDefault: false,
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
