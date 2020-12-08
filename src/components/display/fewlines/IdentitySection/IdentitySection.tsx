import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { AppleIcon } from "../Icons/AppleIcon/AppleIcon";
import { DecathlonIcon } from "../Icons/DecathlonIcon/DecathlonIcon";
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
import { BoxedLink, NoIdentitiesBox } from "../LoginsOverview/LoginsOverview";
import { NeutralLink } from "../NeutralLink";
import { Separator } from "../Separator/Separator";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { ShowMoreButton } from "../ShowMoreButton/ShowMoreButton";
import { Timeline } from "../Timeline/Timeline";
import { Identity, IdentityTypes } from "@lib/@types";
import {
  formatSpecialSocialIdentities,
  capitalizeFirstLetter,
} from "@src/utils/format";
import { getIdentityType } from "@src/utils/getIdentityType";

type IdentitySectionProps = {
  content: {
    title: string;
    identityType: IdentityTypes;
    identitiesList: Identity[];
    noIdentityMessage: string;
    addNewIdentityMessage?: string;
  };
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
  DECATHLON: <DecathlonIcon />,
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
    case IdentityTypes["DECATHLON"]:
      return SOCIAL_IDENTITIES_ICONS.DECATHLON;
    default:
      return <React.Fragment />;
  }
};

const displayIdentityList = (
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
  socialIdentities: Identity[],
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
      {index < socialIdentities.length - 1 && <Separator />}
    </div>
  );
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
          displayedList.map((identity: Identity, index) =>
            [IdentityTypes.EMAIL, IdentityTypes.PHONE].includes(
              getIdentityType(content.identityType),
            )
              ? displayIdentityList(identity, index, displayedList.length - 1)
              : displaySocialLoginsList(identity, index, displayedList),
          )
        )}
      </ShadowBox>

      {[IdentityTypes.EMAIL, IdentityTypes.PHONE].includes(
        getIdentityType(content.identityType),
      ) &&
        content.identitiesList.length > 1 && (
          <Flex>
            <ShowMoreButton
              hide={hideSecondaryIdentities}
              quantity={content.identitiesList.length - 1}
              setHideSecondary={setHideSecondaryIdentities}
            />
          </Flex>
        )}
      {[IdentityTypes.EMAIL, IdentityTypes.PHONE].includes(
        getIdentityType(content.identityType),
      ) && (
        <NeutralLink
          href={`/account/logins/${content.identityType.toLowerCase()}/new`}
        >
          <Button variant={ButtonVariant.SECONDARY}>
            {`+ ${content.addNewIdentityMessage}`}
          </Button>
        </NeutralLink>
      )}
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

const SocialIdentityBox = styled.div`
  display: flex;
  align-items: center;
`;

const SocialIdentityName = styled.p`
  margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
`;
