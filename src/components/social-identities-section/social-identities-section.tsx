import React from "react";
import styled from "styled-components";

import { SectionBox } from "../shadow-box/section-box";
import { Identity, IdentityTypes } from "@lib/@types";
import { IdentitiesSectionContent } from "@src/@types/identities-section-content";
import {
  BoxedLink,
  NoIdentitiesBox,
} from "@src/components/identities-section/identities-section";
import { Separator } from "@src/components/separator/separator";
import {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
} from "@src/utils/format";
import { getSocialIdentityIcon } from "@src/utils/get-social-identities-icon";

type SocialIdentitiesSectionProps = {
  content: IdentitiesSectionContent;
  identitiesList: Identity[];
};

export const SocialIdentitiesSection: React.FC<SocialIdentitiesSectionProps> = ({
  content,
  identitiesList,
}) => {
  const { title, noIdentityMessage } = content;

  return (
    <>
      <h2>{title}</h2>
      <SectionBox>
        {identitiesList.length === 0 ? (
          <NoIdentitiesBox>{noIdentityMessage}</NoIdentitiesBox>
        ) : (
          identitiesList.map((identity: Identity, index) => (
            <div key={identity.type + index}>
              <BoxedLink href={"#"}>
                <SocialIdentityBox>
                  {getSocialIdentityIcon(identity.type)}
                  <SocialIdentityName>
                    {identity.type === IdentityTypes.KAKAO_TALK ||
                    identity.type === IdentityTypes.VKONTAKTE
                      ? formatSpecialSocialIdentities(identity.type)
                      : capitalizeFirstLetter(identity.type)}
                  </SocialIdentityName>
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

const SocialIdentityBox = styled.div`
  display: flex;
  align-items: center;
`;

const SocialIdentityName = styled.p`
  margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
`;
