import { Identity } from "@fewlines/connect-management";
import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { ShowMoreButton } from "../../buttons";
import { NeutralLink } from "../../neutral-link";
import { TimelineEnd, Timeline } from "../../timelines";
import {
  EmailSection,
  PhoneSection,
  SocialSection,
} from "./logins-overview-sections";
import { BoxedLink } from "@src/components/boxed-link";
import { SectionBox } from "@src/components/boxes";
import { SkeletonTextLine } from "@src/components/skeletons";
import { SWRError } from "@src/errors/errors";
import { sortIdentities } from "@src/utils/sort-identities";

const LoginsOverview: React.FC = () => {
  const [hideEmailList, setHideEmailList] = React.useState<boolean>(true);
  const [hidePhoneList, setHidePhoneList] = React.useState<boolean>(true);

  const { data: identities, error } = useSWR<Identity[], SWRError>(
    "/api/identities/",
  );

  if (error) {
    throw error;
  }

  const sortedIdentities = sortIdentities(identities || []);
  const { formatMessage } = useIntl();

  return (
    <>
      <Timeline />
      <h3>{formatMessage({ id: "emailTitle" })}</h3>
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
        <div className="flex justify-center">
          <ShowMoreButton
            hideList={hideEmailList}
            quantity={sortedIdentities.emailIdentities.length - 1}
            onPress={() => setHideEmailList(!hideEmailList)}
          />
        </div>
      ) : null}
      <NeutralLink href={`/account/logins/email/new/`}>
        <div className="btn btn-secondary btn-neutral-link">
          {`+ ${formatMessage({ id: "emailAddNewIdentityMessage" })}`}
        </div>
      </NeutralLink>
      <Timeline />
      <h3>{formatMessage({ id: "phoneTitle" })}</h3>
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
        <div className="flex justify-center">
          <ShowMoreButton
            hideList={hidePhoneList}
            quantity={sortedIdentities.phoneIdentities.length - 1}
            onPress={() => setHidePhoneList(!hidePhoneList)}
          />
        </div>
      ) : null}
      <NeutralLink href={`/account/logins/phone/new/`}>
        <div className="btn btn-secondary btn-neutral-link">
          {`+ ${formatMessage({ id: "phoneAddNewIdentityMessage" })}`}
        </div>
      </NeutralLink>
      <TimelineEnd />
      <h3>{formatMessage({ id: "socialTitle" })}</h3>
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

export { LoginsOverview };
