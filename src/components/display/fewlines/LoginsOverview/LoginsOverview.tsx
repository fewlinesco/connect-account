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
import { BoxedLink, IdentitySection } from "../IdentitySection/IdentitySection";
import { Separator } from "../Separator/Separator";
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

const displayStandardIdentityList = (
  identity: Identity,
  index: number,
  listLength: number,
): JSX.Element => {
  return (
    <div key={identity.type + index}>
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
      {index < listLength && <Separator />}
    </div>
  );
};

const displaySocialLoginsList = (
  identity: Identity,
  index: number,
  listLength: number,
): JSX.Element => {
  return (
    <div key={identity.type + index}>
      <BoxedLink
        primary={false}
        status={identity.status}
        social={true}
        href="#"
      >
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
      {index < listLength - 1 && <Separator />}
    </div>
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
      identityType: IdentityTypes.EMAIL,
      identitiesList: emailIdentities,
      displayListMethod: displayStandardIdentityList,
      noIdentityMessage: "No email added yet.",
      addNewIdentityMessage: "add new email address",
    },
    PHONE: {
      title: "Phone numbers",
      identityType: IdentityTypes.PHONE,
      identitiesList: phoneIdentities,
      displayListMethod: displayStandardIdentityList,
      noIdentityMessage: "No phone number added yet.",
      addNewIdentityMessage: "add new phone number",
    },
    SOCIAL_LOGINS: {
      title: "Social logins",
      identitiesList: socialIdentities,
      displayListMethod: displaySocialLoginsList,
      noIdentityMessage: "No social logins added yet.",
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
