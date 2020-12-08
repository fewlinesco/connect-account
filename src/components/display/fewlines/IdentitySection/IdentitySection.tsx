import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { BoxedLink, NoIdentitiesBox } from "../LoginsOverview/LoginsOverview";
import { NeutralLink } from "../NeutralLink";
import { Separator } from "../Separator/Separator";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { ShowMoreButton } from "../ShowMoreButton/ShowMoreButton";
import { Timeline } from "../Timeline/Timeline";
import { Identity, IdentityTypes } from "@lib/@types";

type IdentitySectionProps = {
  content: {
    title: string;
    identityType: IdentityTypes;
    identitiesList: Identity[];
    noIdentityMessage: string;
    addNewIdentityMessage: string;
  };
};

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  content,
}) => {
  const [
    hideSecondaryIdentities,
    setHideSecondaryIdentities,
  ] = React.useState<boolean>(true);

  let displayedList: Identity[];

  hideSecondaryIdentities
    ? (displayedList = content.identitiesList.filter(
        (identity) => identity.primary,
      ))
    : (displayedList = content.identitiesList);

  return (
    <Section>
      <Timeline />
      <h2>{content.title}</h2>
      <ShadowBox>
        {content.identitiesList.length === 0 ? (
          <NoIdentitiesBox>{content.noIdentityMessage}</NoIdentitiesBox>
        ) : (
          displayedList.map((identity: Identity) => {
            return (
              <div key={identity.id}>
                <BoxedLink
                  primary={identity.primary}
                  status={identity.status}
                  href={{
                    pathname: "/account/logins/[type]/[id]",
                    query: {
                      type: identity.type.toLowerCase(),
                      id: identity.id,
                    },
                  }}
                >
                  <p>{identity.value}</p>
                  <RightChevron />
                </BoxedLink>
                {displayedList.indexOf(identity) < displayedList.length - 1 && (
                  <Separator />
                )}
              </div>
            );
          })
        )}
      </ShadowBox>
      {content.identitiesList.length > 1 && (
        <Flex>
          <ShowMoreButton
            hide={hideSecondaryIdentities}
            quantity={content.identitiesList.length - 1}
            setHideSecondary={setHideSecondaryIdentities}
          />
        </Flex>
      )}
      <NeutralLink
        href={`/account/logins/${content.identityType.toLowerCase()}/new`}
      >
        <Button variant={ButtonVariant.SECONDARY}>
          {`+ ${content.addNewIdentityMessage}`}
        </Button>
      </NeutralLink>
    </Section>
  );
};

const Section = styled.div`
  padding: 0 0 ${({ theme }) => theme.spaces.s} 0;
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
`;
