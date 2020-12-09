import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { NeutralLink } from "../NeutralLink";
import { Separator } from "../Separator/Separator";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { ShowMoreButton } from "../ShowMoreButton/ShowMoreButton";
import { Timeline } from "../Timeline/Timeline";
import { TimelineEnd } from "../TimelineEnd/TimelineEnd";
import { Identity } from "@lib/@types";

type IdentitySectionProps = {
  sectionName: string;
  lastOfTheList: boolean;
  content: {
    title: string;
    identitiesList: Identity[];
    displayListMethod: (identity: Identity) => JSX.Element;
    disableClick: boolean;
    noIdentityMessage: string;
    addNewIdentityMessage?: string;
    hideSecondaryByDefault: boolean;
  };
};

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  sectionName,
  lastOfTheList,
  content,
}) => {
  const [
    hideSecondaryIdentities,
    setHideSecondaryIdentities,
  ] = React.useState<boolean>(true);

  const {
    title,
    identitiesList,
    displayListMethod,
    disableClick,
    noIdentityMessage,
    addNewIdentityMessage,
    hideSecondaryByDefault,
  } = content;

  let displayedList: Identity[] = identitiesList;

  hideSecondaryByDefault &&
    hideSecondaryIdentities &&
    (displayedList = identitiesList.filter((identity) => identity.primary));

  return (
    <Section lastOfTheList={lastOfTheList}>
      {lastOfTheList ? <TimelineEnd /> : <Timeline />}
      <h2>{title}</h2>
      <ShadowBox>
        {identitiesList.length === 0 ? (
          <NoIdentitiesBox>{noIdentityMessage}</NoIdentitiesBox>
        ) : (
          displayedList.map((identity: Identity, index) => (
            <div key={identity.type + index}>
              <BoxedLink
                disableClick={disableClick}
                href={
                  disableClick
                    ? "#"
                    : {
                        pathname: "/account/logins/[type]/[id]",
                        query: {
                          type: identity.type.toLowerCase(),
                          id: identity.id,
                        },
                      }
                }
              >
                {displayListMethod(identity)}
              </BoxedLink>
              {index < displayedList.length - 1 && <Separator />}
            </div>
          ))
        )}
      </ShadowBox>
      {hideSecondaryByDefault && (
        <>
          {identitiesList.length > 1 && (
            <Flex>
              <ShowMoreButton
                hide={hideSecondaryIdentities}
                quantity={identitiesList.length - 1}
                setHideSecondary={setHideSecondaryIdentities}
              />
            </Flex>
          )}
        </>
      )}
      {addNewIdentityMessage && (
        <NeutralLink href={`/account/logins/${sectionName.toLowerCase()}/new`}>
          <Button variant={ButtonVariant.SECONDARY}>
            {`+ ${addNewIdentityMessage}`}
          </Button>
        </NeutralLink>
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

const Flex = styled.div`
  display: flex;
  justify-content: center;
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
