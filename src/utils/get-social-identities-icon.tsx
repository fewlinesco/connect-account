import React from "react";

import { IdentityTypes } from "@lib/@types/Identity";
import { AppleIcon } from "@src/components/display/fewlines/Icons/AppleIcon/AppleIcon";
import { DecathlonIcon } from "@src/components/display/fewlines/Icons/DecathlonIcon/DecathlonIcon";
import { FacebookIcon } from "@src/components/display/fewlines/Icons/FacebookIcon/FacebookIcon";
import { GithubIcon } from "@src/components/display/fewlines/Icons/GithubIcon/GithubIcon";
import { GoogleIcon } from "@src/components/display/fewlines/Icons/GoogleIcon/GoogleIcon";
import { KakaoTalkIcon } from "@src/components/display/fewlines/Icons/KakaoTalkIcon/KakaoTalkIcon";
import { LineIcon } from "@src/components/display/fewlines/Icons/LineIcon/LineIcon";
import { MicrosoftIcon } from "@src/components/display/fewlines/Icons/MicrosoftIcon/MicrosoftIcon";
import { NaverIcon } from "@src/components/display/fewlines/Icons/NaverIcon/NaverIcon";
import { PaypalIcon } from "@src/components/display/fewlines/Icons/PaypalIcon/PaypalIcon";
import { StravaIcon } from "@src/components/display/fewlines/Icons/StravaIcon/StravaIcon";
import { VKontakteIcon } from "@src/components/display/fewlines/Icons/VKontakteIcon/VKontakteIcon";

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

export const getSocialIdentityIcon = (type: IdentityTypes): JSX.Element => {
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
