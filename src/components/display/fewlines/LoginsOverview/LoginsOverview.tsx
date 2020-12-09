import React from "react";
import styled from "styled-components";

import { AppleIcon } from "../Icons/AppleIcon/AppleIcon";
import { FacebookIcon } from "../Icons/FacebookIcon/FacebookIcon";
import { GithubIcon } from "../Icons/GithubIcon/GithubIcon";
import { GoogleIcon } from "../Icons/GoogleIcon/GoogleIcon";
import { KakaoTalkIcon } from "../Icons/KakaoTalkIcon/KakaoTalkIcon";
import { LineIcon } from "../Icons/LineIcon/LineIcon";
import { MicrosoftIcon } from "../Icons/MicrosoftIcon/MicrosoftIcon";
import { NaverIcon } from "../Icons/NaverIcon/NaverIcon";
import { PaypalIcon } from "../Icons/PaypalIcon/PaypalIcon";
import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { StravaIcon } from "../Icons/StravaIcon/StravaIcon";
import { VKontakteIcon } from "../Icons/VKontakteIcon/VKontakteIcon";
import { IdentitySection } from "../IdentitySection/IdentitySection";
import { Identity, IdentityTypes } from "@lib/@types/Identity";
import { SortedIdentities } from "@src/@types/SortedIdentities";
import {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
} from "@src/utils/format";

type LoginsOverviewProps = {
  sortedIdentities: SortedIdentities;
};

const SOCIAL_IDENTITIES_ICONS = {
  APPLE: <AppleIcon />,
  FACEBOOK: <FacebookIcon />,
  GITHUB: <GithubIcon />,
  GOOGLE: <GoogleIcon />,
  KAKAO_TALK: <KakaoTalkIcon />,
  LINE: <LineIcon />,
  NAVER: <NaverIcon />,
  PAYPAL: <PaypalIcon />,
  STRAVA: <StravaIcon />,
  VKONTAKTE: <VKontakteIcon />,
  MICROSOFT: <MicrosoftIcon />,
};

const getSocialIdentityIcon = (type: IdentityTypes): JSX.Element => {
  switch (type) {
    case IdentityTypes["APPLE"]:
      return SOCIAL_IDENTITIES_ICONS.APPLE;
    case IdentityTypes["FACEBOOK"]:
      return SOCIAL_IDENTITIES_ICONS.FACEBOOK;
    case IdentityTypes["GITHUB"]:
      return SOCIAL_IDENTITIES_ICONS.GITHUB;
    case IdentityTypes["GOOGLE"]:
      return SOCIAL_IDENTITIES_ICONS.GOOGLE;
    case IdentityTypes["KAKAO_TALK"]:
      return SOCIAL_IDENTITIES_ICONS.KAKAO_TALK;
    case IdentityTypes["LINE"]:
      return SOCIAL_IDENTITIES_ICONS.LINE;
    case IdentityTypes["NAVER"]:
      return SOCIAL_IDENTITIES_ICONS.NAVER;
    case IdentityTypes["PAYPAL"]:
      return SOCIAL_IDENTITIES_ICONS.PAYPAL;
    case IdentityTypes["STRAVA"]:
      return SOCIAL_IDENTITIES_ICONS.STRAVA;
    case IdentityTypes["VKONTAKTE"]:
      return SOCIAL_IDENTITIES_ICONS.VKONTAKTE;
    case IdentityTypes["MICROSOFT"]:
      return SOCIAL_IDENTITIES_ICONS.MICROSOFT;
    default:
      return <React.Fragment />;
  }
};

const displayStandardIdentityList = (identity: Identity): JSX.Element => {
  return (
    <>
      <IdentityValue primary={identity.primary} status={identity.status}>
        {identity.value}
      </IdentityValue>
      <RightChevron />
    </>
  );
};

const displaySocialLoginsList = (identity: Identity): JSX.Element => {
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

export const LoginsOverview: React.FC<LoginsOverviewProps> = ({
  sortedIdentities,
}) => {
  const {
    emailIdentities,
    phoneIdentities,
    socialIdentities,
  } = sortedIdentities;

  const IDENTITY_SECTION_CONTENT = {
    EMAIL: {
      title: "Email addresses",
      identitiesList: emailIdentities,
      displayListMethod: displayStandardIdentityList,
      disableClick: false,
      noIdentityMessage: "No email added yet.",
      addNewIdentityMessage: "add new email address",
      hideSecondaryByDefault: true,
    },
    PHONE: {
      title: "Phone numbers",
      identitiesList: phoneIdentities,
      displayListMethod: displayStandardIdentityList,
      disableClick: false,
      noIdentityMessage: "No phone number added yet.",
      addNewIdentityMessage: "add new phone number",
      hideSecondaryByDefault: true,
    },
    SOCIAL_LOGINS: {
      title: "Social logins",
      identitiesList: socialIdentities,
      displayListMethod: displaySocialLoginsList,
      disableClick: true,
      noIdentityMessage: "No social logins added yet.",
      hideSecondaryByDefault: false,
    },
  };

  const identitySectionList = Object.entries(IDENTITY_SECTION_CONTENT);

  return (
    <Container>
      {identitySectionList.map(([sectionName, content], index) => {
        const lastOfTheList = index === identitySectionList.length - 1;

        return (
          <IdentitySection
            key={sectionName}
            sectionName={sectionName}
            content={content}
            lastOfTheList={lastOfTheList}
          />
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  margin: 0 0 10rem 0;
`;

const SocialIdentityBox = styled.div`
  display: flex;
  align-items: center;
`;

const SocialIdentityName = styled.p`
  margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
`;

export const IdentityValue = styled.p<Pick<Identity, "primary" | "status">>`
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
