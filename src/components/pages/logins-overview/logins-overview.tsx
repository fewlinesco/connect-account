import { Identity } from "@fewlines/connect-management";
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
import { BoxedLink } from "@src/components/boxed-link/boxed-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { sortIdentities } from "@src/utils/sort-identities";

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

  const { data: identities, error } = useSWR<Identity[], Error>(
    "/api/identities",
  );

  if (error) {
    throw error;
  }

  const sortedIdentities = sortIdentities(identities || []);

  return (
    <>
      <Timeline />
      <h2>{IDENTITIES_SECTION_CONTENT.EMAIL.title}</h2>
      <SectionBox>
        {!identities ? (
          <BoxedLink disableClick={true} href="#">
            <SkeletonTextLine fontSize={1.6} width={50} />
          </BoxedLink>
        ) : (
          <EmailSection
            identityList={sortedIdentities.emailIdentities}
            hideEmailList={hideEmailList}
          />
        )}
      </SectionBox>
      {identities && sortedIdentities.emailIdentities.length > 1 ? (
        <Flex>
          <ShowMoreButton
            hideList={hideEmailList}
            quantity={sortedIdentities.emailIdentities.length - 1}
            onPress={() => setHideEmailList(!hideEmailList)}
          />
        </Flex>
      ) : null}
      <NeutralLink href={`/account/logins/email/new`}>
        <FakeButton variant={ButtonVariant.SECONDARY}>
          {`+ ${IDENTITIES_SECTION_CONTENT.EMAIL.addNewIdentityMessage}`}
        </FakeButton>
      </NeutralLink>
      <Timeline />
      <h2>{IDENTITIES_SECTION_CONTENT.PHONE.title}</h2>
      <SectionBox>
        {!identities ? (
          <BoxedLink disableClick={true} href="#">
            <SkeletonTextLine fontSize={1.6} width={50} />
          </BoxedLink>
        ) : (
          <PhoneSection
            identityList={sortedIdentities.phoneIdentities}
            hideEmailList={hidePhoneList}
          />
        )}
      </SectionBox>
      {identities && sortedIdentities.phoneIdentities.length > 1 ? (
        <Flex>
          <ShowMoreButton
            hideList={hidePhoneList}
            quantity={sortedIdentities.phoneIdentities.length - 1}
            onPress={() => setHidePhoneList(!hidePhoneList)}
          />
        </Flex>
      ) : null}
      <NeutralLink href={`/account/logins/phone/new`}>
        <FakeButton variant={ButtonVariant.SECONDARY}>
          {`+ ${IDENTITIES_SECTION_CONTENT.PHONE.addNewIdentityMessage}`}
        </FakeButton>
      </NeutralLink>
      <TimelineEnd />
      <h2>{IDENTITIES_SECTION_CONTENT.SOCIAL.title}</h2>
      <SectionBox>
        {!identities ? (
          <BoxedLink disableClick={true} href="#">
            <SkeletonTextLine fontSize={1.6} width={50} />
          </BoxedLink>
        ) : (
          <SocialSection identityList={sortedIdentities.socialIdentities} />
        )}
      </SectionBox>
    </>
  );
};

const Flex = styled.div`
  display: flex;
  justify-content: center;
`;

export { LoginsOverview, IDENTITIES_SECTION_CONTENT };
