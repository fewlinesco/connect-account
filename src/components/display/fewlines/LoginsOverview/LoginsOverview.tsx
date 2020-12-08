import React from "react";
import styled from "styled-components";

import { IdentitySection } from "../IdentitySection/IdentitySection";
import { NeutralLink } from "../NeutralLink";
import type { Identity } from "@lib/@types";
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
      identityType: IdentityTypes.GITHUB,
      identitiesList: socialIdentities,
      noIdentityMessage: "No social logins added yet.",
    },
  };

  return (
    <Container>
      {Object.entries(IDENTITY_SECTION_CONTENT).map(
        ([sectionName, content]) => {
          return <IdentitySection key={sectionName} content={content} />;
        },
      )}
    </Container>
  );
};

const Container = styled.div`
  margin: 0 0 10rem 0;
`;

// const LastIdentitySections = styled(IdentitySections)`
//   padding: 0;
// `;

export const NoIdentitiesBox = styled.p`
  display: flex;
  align-items: center;
  height: 7.2rem;
  margin-right: 0.5rem;
  padding: 0 2rem;
`;

type BoxedLinkProps = Pick<Identity, "primary" | "status"> & {
  social?: boolean;
};

export const BoxedLink = styled(NeutralLink)<BoxedLinkProps>`
  height: 7.2rem;
  padding: 0 ${({ theme }) => theme.spaces.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${(props) =>
    props.social &&
    `
      cursor: default;
    `}

  ${(props) =>
    props.primary &&
    `
        font-weight: ${props.theme.fontWeights.semibold};
    `}

  ${(props) =>
    props.status === "unvalidated" &&
    `
    color: ${props.theme.colors.lightGrey};
    `};
`;
