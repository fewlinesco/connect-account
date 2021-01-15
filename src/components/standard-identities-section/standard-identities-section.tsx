import React from "react";
import styled from "styled-components";

import { ButtonVariant } from "../button/button";
import { FakeButton } from "../fake-button/fake-button";
import { RightChevron } from "../icons/right-chevron/right-chevron";
import {
  BoxedLink,
  NoIdentitiesBox,
} from "../identities-section/identities-section";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Separator } from "../separator/separator";
import { SectionBox } from "../shadow-box/section-box";
import { ShowMoreButton } from "../show-more-button/show-more-button";
import { Identity } from "@lib/@types";
import { IdentitiesSectionContent } from "@src/@types/identities-section-content";

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

const Flex = styled.div`
  display: flex;
  justify-content: center;
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
