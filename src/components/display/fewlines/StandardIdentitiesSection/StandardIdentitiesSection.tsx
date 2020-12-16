import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { RightChevron } from "../Icons/RightChevron/RightChevron";
import {
  BoxedLink,
  NoIdentitiesBox,
} from "../IdentitiesSection/IdentitiesSection";
import { NeutralLink } from "../NeutralLink";
import { Separator } from "../Separator/Separator";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { ShowMoreButton } from "../ShowMoreButton/ShowMoreButton";
import { Identity } from "@lib/@types";
import { IdentitiesSectionContent } from "@src/@types/identitiesSectionContent";

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
      <ShadowBox>
        {identitiesList.length === 0 ? (
          <NoIdentitiesBox>{noIdentityMessage}</NoIdentitiesBox>
        ) : (
          displayedList.map((identity: Identity, index) => (
            <div key={identity.type + index}>
              <BoxedLink
                disableClick={false}
                href={{
                  pathname: "/account/logins/[type]/[id]",
                  query: {
                    type: identity.type.toLowerCase(),
                    id: identity.id,
                  },
                }}
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
      </ShadowBox>
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
        <Button variant={ButtonVariant.SECONDARY}>
          {`+ ${addNewIdentityMessage}`}
        </Button>
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
