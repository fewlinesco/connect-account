import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { ButtonVariant, ShowMoreButton } from "../../buttons/buttons";
import { FakeButton } from "../../buttons/fake-button";
import { NeutralLink } from "../../neutral-link/neutral-link";
import { SectionBox } from "../../shadow-box/section-box";
import { TimelineEnd, Timeline } from "../../timelines/timelines";
import {
  EmailSection,
  PhoneSection,
  SocialSection,
} from "./logins-overview-sections";
import { SortedIdentities } from "@src/@types/sorted-identities";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";

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
  SOCIAL: {
    title: "Social logins",
    noIdentityMessage: "No social logins added yet.",
  },
};

const LoginsOverview: React.FC = () => {
  const [hideEmailList, setHideEmailList] = React.useState<boolean>(true);
  const [hidePhoneList, setHidePhoneList] = React.useState<boolean>(true);

  const { data, error } = useSWR<{ sortedIdentities: SortedIdentities }, Error>(
    "/api/identity/get-sorted-identities",
  );

  if (error) {
    throw error;
  }

  return (
    <>
      <SectionWrapper>
        <Timeline />
        <h2>{IDENTITIES_SECTION_CONTENT.EMAIL.title}</h2>
        <SectionBox>
          {!data ? (
            <BoxedLink disableClick={true} href="#">
              <SkeletonTextLine fontSize={1.4} />
            </BoxedLink>
          ) : (
            <EmailSection
              identityList={data.sortedIdentities.emailIdentities}
              hideEmailList={hideEmailList}
            />
          )}
        </SectionBox>
        {data && data.sortedIdentities.emailIdentities.length > 1 ? (
          <Flex>
            <ShowMoreButton
              hideList={hideEmailList}
              quantity={data.sortedIdentities.emailIdentities.length - 1}
              setHideList={setHideEmailList}
            />
          </Flex>
        ) : null}
        <NeutralLink href={`/account/logins/email/new`}>
          <FakeButton variant={ButtonVariant.SECONDARY}>
            {`+ ${IDENTITIES_SECTION_CONTENT.EMAIL.addNewIdentityMessage}`}
          </FakeButton>
        </NeutralLink>
      </SectionWrapper>
      <SectionWrapper>
        <Timeline />
        <h2>{IDENTITIES_SECTION_CONTENT.PHONE.title}</h2>
        <SectionBox>
          {!data ? (
            <BoxedLink disableClick={true} href="#">
              <SkeletonTextLine fontSize={1.4} />
            </BoxedLink>
          ) : (
            <PhoneSection
              identityList={data.sortedIdentities.phoneIdentities}
              hideEmailList={hidePhoneList}
            />
          )}
        </SectionBox>
        {data && data.sortedIdentities.phoneIdentities.length > 1 ? (
          <Flex>
            <ShowMoreButton
              hideList={hidePhoneList}
              quantity={data.sortedIdentities.phoneIdentities.length - 1}
              setHideList={setHidePhoneList}
            />
          </Flex>
        ) : null}
        <NeutralLink href={`/account/logins/phone/new`}>
          <FakeButton variant={ButtonVariant.SECONDARY}>
            {`+ ${IDENTITIES_SECTION_CONTENT.PHONE.addNewIdentityMessage}`}
          </FakeButton>
        </NeutralLink>
      </SectionWrapper>
      <SectionWrapper isLastOfTheList={true}>
        <TimelineEnd />
        <h2>{IDENTITIES_SECTION_CONTENT.SOCIAL.title}</h2>
        <SectionBox>
          {!data ? (
            <BoxedLink disableClick={true} href="#">
              <SkeletonTextLine fontSize={1.4} />
            </BoxedLink>
          ) : (
            <SocialSection
              identityList={data.sortedIdentities.socialIdentities}
            />
          )}
        </SectionBox>
      </SectionWrapper>
    </>
  );
};

const Flex = styled.div`
  display: flex;
  justify-content: center;
`;

const SectionWrapper = styled.div<{
  isLastOfTheList?: boolean;
}>`
  padding: 0 0 ${({ theme }) => theme.spaces.s} 0;
  position: relative;

  ${({ isLastOfTheList }) =>
    isLastOfTheList &&
    `
      padding: 0;
    `}
`;

const BoxedLink = styled(NeutralLink)<{
  disableClick?: boolean;
}>`
  height: 7.2rem;
  padding: 0 ${({ theme }) => theme.spaces.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ disableClick }) =>
    disableClick &&
    `
        cursor: default;
      `}
`;

export { LoginsOverview, IDENTITIES_SECTION_CONTENT, BoxedLink };
