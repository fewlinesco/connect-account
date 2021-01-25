import React from "react";
import styled from "styled-components";

import { ButtonVariant, ShowMoreButton } from "../buttons/buttons";
import { FakeButton } from "../fake-button/fake-button";
import { RightChevron } from "../icons/right-chevron/right-chevron";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Separator } from "../separator/separator";
import { SectionBox } from "../shadow-box/section-box";
import { TimelineEnd, Timeline } from "../timeline/timeline";
import { Identity, IdentityTypes } from "@lib/@types";
import { IdentitiesSectionContent } from "@src/@types/identities-section-content";
import { SortedIdentities } from "@src/@types/sorted-identities";
import {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
} from "@src/utils/format";
import { getSocialIdentityIcon } from "@src/utils/get-social-identities-icon";

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

type StandardIdentitiesSectionProps = {
  sectionName: string;
  content: IdentitiesSectionContent;
  identitiesList: Identity[];
};

export const StandardIdentitiesSection: React.FC<StandardIdentitiesSectionProps> = ({
  sectionName,
  content,
  identitiesList,
}) => {
  const [
    hideSecondaryIdentities,
    setHideSecondaryIdentities,
  ] = React.useState<boolean>(true);

  const { title, noIdentityMessage, addNewIdentityMessage } = content;

  let displayedList: Identity[] = identitiesList;

  hideSecondaryIdentities &&
    (displayedList = identitiesList.filter((identity) => identity.primary));

  return (
    <>
      <h2>{title}</h2>
      <SectionBox>
        {identitiesList.length === 0 ? (
          <NoIdentitiesBox>{noIdentityMessage}</NoIdentitiesBox>
        ) : (
          displayedList.map((identity: Identity, index) => (
            <div key={identity.type + index}>
              <BoxedLink
                disableClick={false}
                href={`/account/logins/${identity.type.toLowerCase()}/${
                  identity.id
                }`}
              >
                <>
                  <IdentityValue
                    primary={identity.primary}
                    status={identity.status}
                  >
                    {identity.value}
                  </IdentityValue>
                  <RightChevron />
                </>
              </BoxedLink>
              {index < displayedList.length - 1 && <Separator />}
            </div>
          ))
        )}
      </SectionBox>
      {identitiesList.length > 1 && (
        <Flex>
          <ShowMoreButton
            hide={hideSecondaryIdentities}
            quantity={identitiesList.length - 1}
            setHideSecondary={setHideSecondaryIdentities}
          />
        </Flex>
      )}
      <NeutralLink href={`/account/logins/${sectionName.toLowerCase()}/new`}>
        <FakeButton variant={ButtonVariant.SECONDARY}>
          {`+ ${addNewIdentityMessage}`}
        </FakeButton>
      </NeutralLink>
    </>
  );
};

type SocialIdentitiesSectionProps = {
  content: IdentitiesSectionContent;
  identitiesList: Identity[];
};

export const SocialIdentitiesSection: React.FC<SocialIdentitiesSectionProps> = ({
  content,
  identitiesList,
}) => {
  const { title, noIdentityMessage } = content;

  return (
    <>
      <h2>{title}</h2>
      <SectionBox>
        {identitiesList.length === 0 ? (
          <NoIdentitiesBox>{noIdentityMessage}</NoIdentitiesBox>
        ) : (
          identitiesList.map((identity: Identity, index) => (
            <div key={identity.type + index}>
              <BoxedLink href={"#"}>
                <SocialIdentityBox>
                  {getSocialIdentityIcon(identity.type)}
                  <SocialIdentityName>
                    {identity.type === IdentityTypes.KAKAO_TALK ||
                    identity.type === IdentityTypes.VKONTAKTE
                      ? formatSpecialSocialIdentities(identity.type)
                      : capitalizeFirstLetter(identity.type)}
                  </SocialIdentityName>
                </SocialIdentityBox>
              </BoxedLink>
              {index < identitiesList.length - 1 && <Separator />}
            </div>
          ))
        )}
      </SectionBox>
    </>
  );
};

const Container = styled.div`
  margin: 0 0 10rem 0;
`;

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

const Flex = styled.div`
  display: flex;
  justify-content: center;
`;

const SocialIdentityBox = styled.div`
  display: flex;
  align-items: center;
`;

const IdentityValue = styled.p<Pick<Identity, "primary" | "status">>`
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

const SocialIdentityName = styled.p`
  margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
`;
