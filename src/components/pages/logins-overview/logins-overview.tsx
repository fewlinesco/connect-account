import { Identity, IdentityTypes } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { ButtonVariant, ShowMoreButton } from "../../buttons/buttons";
import { FakeButton } from "../../buttons/fake-button";
import { RightChevron } from "../../icons/right-chevron/right-chevron";
import { NeutralLink } from "../../neutral-link/neutral-link";
import { Separator } from "../../separator/separator";
import { SectionBox } from "../../shadow-box/section-box";
import { TimelineEnd, Timeline } from "../../timelines/timelines";
import { SortedIdentities } from "@src/@types/sorted-identities";
import { LoginsSkeleton } from "@src/components/skeletons/skeletons";
import {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
} from "@src/utils/format";
import { getSocialIdentityIcon } from "@src/utils/get-social-identities-icon";

const IDENTITIES_SECTION_CONTENT = {
  EMAIL: {
    title: "Email addresses",
    noIdentityMessage: "No email added yet.",
    addNewIdentityMessage: "Add new email address",
  },
  PHONE: {
    title: "Phone numbers",
    noIdentityMessage: "No phone number added yet.",
    addNewIdentityMessage: "Add new phone number",
  },
  SOCIAL_LOGINS: {
    title: "Social logins",
    noIdentityMessage: "No social logins added yet.",
  },
};

const LoginsOverview: React.FC = () => {
  const { data, error } = useSWR<{ sortedIdentities: SortedIdentities }, Error>(
    "/api/identity/get-sorted-identities",
  );

  if (error) {
    throw error;
  }

  if (!data) {
    return <LoginsSkeleton />;
  }

  const {
    emailIdentities,
    phoneIdentities,
    socialIdentities,
  } = data.sortedIdentities;

  const identitiesSectionList = Object.entries(IDENTITIES_SECTION_CONTENT);

  return (
    <>
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
          <Section key={sectionName} lastOfTheList={lastOfTheList}>
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
      })}
    </>
  );
};

type IdentitiesSectionContent = {
  title: string;
  noIdentityMessage: string;
  addNewIdentityMessage?: string;
};

const StandardIdentitiesSection: React.FC<{
  sectionName: string;
  content: IdentitiesSectionContent;
  identitiesList: Identity[];
}> = ({ sectionName, content, identitiesList }) => {
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
          <NoIdentitiesParagraph>{noIdentityMessage}</NoIdentitiesParagraph>
        ) : (
          displayedList.map((identity: Identity, index) => (
            <div key={identity.type + index}>
              <BoxedLink
                disableClick={false}
                href={`/account/logins/${identity.type.toLowerCase()}/${
                  identity.id
                }`}
              >
                <IdentityValue
                  primary={identity.primary}
                  status={identity.status}
                >
                  {identity.value}
                </IdentityValue>
                <RightChevron />
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

const SocialIdentitiesSection: React.FC<{
  content: IdentitiesSectionContent;
  identitiesList: Identity[];
}> = ({ content, identitiesList }) => {
  const { title, noIdentityMessage } = content;

  return (
    <>
      <h2>{title}</h2>
      <SectionBox>
        {identitiesList.length === 0 ? (
          <NoIdentitiesParagraph>{noIdentityMessage}</NoIdentitiesParagraph>
        ) : (
          identitiesList.map((identity: Identity, index) => (
            <div key={identity.type + index}>
              <BoxedLink href={"#"}>
                <SocialIdentityBox>
                  {getSocialIdentityIcon(identity.type)}
                  <p>
                    {identity.type === IdentityTypes.KAKAO_TALK ||
                    identity.type === IdentityTypes.VKONTAKTE
                      ? formatSpecialSocialIdentities(identity.type)
                      : capitalizeFirstLetter(identity.type)}
                  </p>
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

const Section = styled.div<{
  lastOfTheList: boolean;
}>`
  padding: 0 0 ${({ theme }) => theme.spaces.s} 0;
  position: relative;

  ${(props) =>
    props.lastOfTheList &&
    `
      padding: 0;
    `}
`;

const NoIdentitiesParagraph = styled.p`
  display: flex;
  align-items: center;
  height: 7.2rem;
  margin-right: 0.5rem;
  padding: 0 2rem;
`;

const BoxedLink = styled(NeutralLink)<{
  disableClick?: boolean;
}>`
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

  p {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
  }
`;

const IdentityValue = styled.p<Pick<Identity, "primary" | "status">>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;

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

export { SocialIdentitiesSection, StandardIdentitiesSection, LoginsOverview };
