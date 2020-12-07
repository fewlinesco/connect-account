import React from "react";
import styled from "styled-components";

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
import { StravaIcon } from "../Icons/StravaIcon/StravaIcon";
import { VKontakteIcon } from "../Icons/VKontakteIcon/VKontakteIcon";
import { IdentitySection } from "../IdentitySection/IdentitySection";
import { NeutralLink } from "../NeutralLink";
import { Separator } from "../Separator/Separator";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { TimelineEnd } from "../TimelineEnd/TimelineEnd";
import type { Identity } from "@lib/@types";
import { IdentityTypes } from "@lib/@types/Identity";
import { SortedIdentities } from "@src/@types/SortedIdentities";
import {
  formatSpecialSocialIdentities,
  capitalizeFirstLetter,
} from "@src/utils/format";

type LoginsOverviewProps = {
  sortedIdentities: SortedIdentities;
};

export const LoginsOverview: React.FC<LoginsOverviewProps> = ({
  sortedIdentities,
}) => {
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

  const {
    emailIdentities,
    phoneIdentities,
    socialIdentities,
  } = sortedIdentities;

  const IDENTITY_SECTION_CONTENT = {
    EMAIL: {
      title: "Email Addresses",
      identitiesList: emailIdentities,
      noIdentityMessage: "No email added yet.",
      addNewIdentityMessage: "add new email address",
    },
    PHONE: {
      title: "Phone numbers",
      identitiesList: phoneIdentities,
      noIdentityMessage: "No phone number added yet.",
      addNewIdentityMessage: "add new phone number",
    },
  };

  return (
    <Container>
      {Object.entries(IDENTITY_SECTION_CONTENT).map(
        ([sectionName, content]) => {
          return <IdentitySection key={sectionName} content={content} />;
        },
      )}
      <LastIdentitySections>
        <TimelineEnd />
        <h2>Social logins</h2>
        <ShadowBox>
          {socialIdentities.length === 0 ? (
            <NoIdentitiesBox>No social logins added yet.</NoIdentitiesBox>
          ) : (
            socialIdentities.map((identity: Identity, index) => {
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
                  {socialIdentities.indexOf(identity) <
                    socialIdentities.length - 1 && <Separator />}
                </div>
              );
            })
          )}
        </ShadowBox>
      </LastIdentitySections>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 0 10rem 0;
`;

const IdentitySections = styled.div`
  padding: 0 0 ${({ theme }) => theme.spaces.s} 0;
  position: relative;
`;

const LastIdentitySections = styled(IdentitySections)`
  padding: 0;
`;

const SocialIdentityBox = styled.div`
  display: flex;
  align-items: center;
`;

const SocialIdentityName = styled.p`
  margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
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
