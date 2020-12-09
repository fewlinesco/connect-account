import React from "react";
import styled from "styled-components";

import { getSocialIdentityIcon } from "./getSocialIdentitiesIcon";
import { Identity, IdentityTypes } from "@lib/@types";
import {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
} from "@src/utils/format";

export const displaySocialLogins = (identity: Identity): JSX.Element => {
  return (
    <SocialIdentityBox>
      {getSocialIdentityIcon(identity.type)}
      <SocialIdentityName>
        {identity.type === IdentityTypes.KAKAO_TALK ||
        identity.type === IdentityTypes.VKONTAKTE
          ? formatSpecialSocialIdentities(identity.type)
          : capitalizeFirstLetter(identity.type)}
      </SocialIdentityName>
    </SocialIdentityBox>
  );
};

const SocialIdentityBox = styled.div`
  display: flex;
  align-items: center;
`;

const SocialIdentityName = styled.p`
  margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
`;
