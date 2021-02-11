import { IdentityTypes } from "@fewlines/connect-management";
import React from "react";

import { AppleIcon } from "@src/components/icons/apple-icon/apple-icon";
import { DecathlonIcon } from "@src/components/icons/decathlon-icon/decathlon-icon";
import { FacebookIcon } from "@src/components/icons/facebook-icon/facebook-icon";
import { GithubIcon } from "@src/components/icons/github-icon/github-icon";
import { GoogleIcon } from "@src/components/icons/google-icon/google-icon";
import { KakaoTalkIcon } from "@src/components/icons/kakao-talk-icon/kakao-talk-icon";
import { LineIcon } from "@src/components/icons/line-icon/line-icon";
import { MicrosoftIcon } from "@src/components/icons/microsoft-icon/microsoft-icon";
import { NaverIcon } from "@src/components/icons/naver-icon/naver-icon";
import { PaypalIcon } from "@src/components/icons/paypal-icon/paypal-icon";
import { StravaIcon } from "@src/components/icons/strava-icon/strava-icon";
import { VKontakteIcon } from "@src/components/icons/vkontakte-icon/vkontakte-icon";

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

export { getSocialIdentityIcon };
