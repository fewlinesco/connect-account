import React from "react";
import styled from "styled-components";

import { Timeline } from "../../../timeline/timeline";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import { SocialIdentitiesSection } from "../SocialIdentitiesSection/SocialIdentitiesSection";
import { StandardIdentitiesSection } from "../StandardIdentitiesSection/StandardIdentitiesSection";
import { TimelineEnd } from "../TimelineEnd/TimelineEnd";
import { Identity } from "@lib/@types";
import { IdentitiesSectionContent } from "@src/@types/identities-section-content";

type IdentitiesSectionProps = {
  sectionName: string;
  lastOfTheList: boolean;
  content: IdentitiesSectionContent;
  identitiesList: Identity[];
};

export const IdentitiesSection: React.FC<IdentitiesSectionProps> = ({
  sectionName,
  lastOfTheList,
  content,
  identitiesList,
}) => {
  return (
    <Section lastOfTheList={lastOfTheList}>
      {lastOfTheList ? <TimelineEnd /> : <Timeline />}
      {sectionName !== "SOCIAL_LOGINS" ? (
        <StandardIdentitiesSection
          sectionName={sectionName}
          content={content}
          identitiesList={identitiesList}
        />
      ) : (
        <SocialIdentitiesSection
          content={content}
          identitiesList={identitiesList}
        />
      )}
    </Section>
  );
};

type SectionProps = {
  lastOfTheList: boolean;
};

const Section = styled.div<SectionProps>`
  padding: 0 0 ${({ theme }) => theme.spaces.s} 0;
  position: relative;

  ${(props) =>
    props.lastOfTheList &&
    `
      padding: 0;
    `}
`;

export const NoIdentitiesBox = styled.p`
  display: flex;
  align-items: center;
  height: 7.2rem;
  margin-right: 0.5rem;
  padding: 0 2rem;
`;

type BoxedLinkProps = {
  disableClick?: boolean;
};

export const BoxedLink = styled(NeutralLink)<BoxedLinkProps>`
  height: 7.2rem;
  padding: 0 ${({ theme }) => theme.spaces.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${(props) =>
    props.disableClick &&
    `
        cursor: default;
      `}
`;
