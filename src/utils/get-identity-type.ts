import { IdentityTypes } from "@fewlines/connect-management";

import { UnhandledIdentityType } from "@src/errors/errors";

function getIdentityType(type: string): IdentityTypes {
  // This check is due to Next's internals causing issue with params when navigating directly to an url.
  // It will be removed when issue will be fixed.
  if (typeof type !== "string") {
    throw new UnhandledIdentityType(`Can't deal with identity type ${type}`);
  }

  switch (type.toUpperCase()) {
    case "EMAIL":
      return IdentityTypes.EMAIL;
    case "PHONE":
      return IdentityTypes.PHONE;
    case "APPLE":
      return IdentityTypes.APPLE;
    case "FACEBOOK":
      return IdentityTypes.FACEBOOK;
    case "GITHUB":
      return IdentityTypes.GITHUB;
    case "GOOGLE":
      return IdentityTypes.GOOGLE;
    case "KAKAO_TALK":
      return IdentityTypes.KAKAO_TALK;
    case "LINE":
      return IdentityTypes.LINE;
    case "NAVER":
      return IdentityTypes.NAVER;
    case "PAYPAL":
      return IdentityTypes.PAYPAL;
    case "STRAVA":
      return IdentityTypes.STRAVA;
    case "VKONTAKTE":
      return IdentityTypes.VKONTAKTE;
    case "MICROSOFT":
      return IdentityTypes.MICROSOFT;
    case "PROVIDER":
      return IdentityTypes.PROVIDER;
    case "DECATHLON":
      return IdentityTypes.DECATHLON;
    default:
      throw new UnhandledIdentityType(`Can't deal with identity type ${type}`);
  }
}

export { getIdentityType };
