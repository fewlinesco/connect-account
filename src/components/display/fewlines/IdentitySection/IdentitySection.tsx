import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { NeutralLink } from "../NeutralLink";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { ShowMoreButton } from "../ShowMoreButton/ShowMoreButton";
import { Timeline } from "../Timeline/Timeline";
import { TimelineEnd } from "../TimelineEnd/TimelineEnd";
import { Identity, IdentityTypes } from "@lib/@types";

type IdentitySectionProps = {
  lastOfTheList: boolean;
  content: {
    title: string;
    identityType?: IdentityTypes;
    identitiesList: Identity[];
    displayListMethod: (
      identity: Identity,
      index: number,
      listLength: number,
    ) => JSX.Element;
    noIdentityMessage: string;
    addNewIdentityMessage?: string;
  };
};

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  lastOfTheList,
  content,
}) => {
  const [
    hideSecondaryIdentities,
    setHideSecondaryIdentities,
  ] = React.useState<boolean>(true);

  const {
    title,
    identityType,
    identitiesList,
    displayListMethod,
    noIdentityMessage,
    addNewIdentityMessage,
  } = content;

  let displayedList: Identity[] = identitiesList;

  identityType &&
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
          displayedList.map((identity: Identity, index) =>
            displayListMethod(identity, index, displayedList.length - 1),
          )
        )}
      </ShadowBox>
      {identityType && (
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
          <NeutralLink
            href={`/account/logins/${identityType.toLowerCase()}/new`}
          >
            <Button variant={ButtonVariant.SECONDARY}>
              {`+ ${addNewIdentityMessage}`}
            </Button>
          </NeutralLink>
        </>
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
