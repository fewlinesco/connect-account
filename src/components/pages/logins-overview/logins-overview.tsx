import { Identity } from "@fewlines/connect-management";
import React from "react";
import { useIntl } from "react-intl";
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
  const { formatMessage } = useIntl();

  return (
    <>
      <Timeline />
      <h2>{formatMessage({ id: "emailTitle" })}</h2>
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
      <NeutralLink href={`/account/logins/email/new/`}>
        <FakeButton variant={ButtonVariant.SECONDARY}>
          {`+ ${formatMessage({ id: "emailAddNewIdentityMessage" })}`}
        </FakeButton>
      </NeutralLink>
      <Timeline />
      <h2>{formatMessage({ id: "phoneTitle" })}</h2>
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
      <NeutralLink href={`/account/logins/phone/new/`}>
        <FakeButton variant={ButtonVariant.SECONDARY}>
          {`+ ${formatMessage({ id: "phoneAddNewIdentityMessage" })}`}
        </FakeButton>
      </NeutralLink>
      <TimelineEnd />
      <h2>{formatMessage({ id: "socialTitle" })}</h2>
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

export { LoginsOverview };
