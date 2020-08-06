export enum IdentityTypes {
  EMAIL = "EMAIL",
  FACEBOOK = "FACEBOOK",
  GITHUB = "GITHUB",
  GOOGLE = "GOOGLE",
  KAKAO_TALK = "KAKAO_TALK",
  LINE = "LINE",
  PHONE = "PHONE",
  PROVIDER = "PROVIDER",
  STRAVA = "STRAVA",
  VKONTAKTE = "VKONTAKTE",
}

export enum ReceivedIdentityTypes {
  EMAIL = "email",
  FACEBOOK = "facebook",
  GITHUB = "github",
  GOOGLE = "google",
  KAKAO_TALK = "kakao_talk",
  LINE = "line",
  PHONE = "phone",
  PROVIDER = "provider",
  STRAVA = "strava",
  VKONTAKTE = "vkontakte",
}

export type Identity = {
  id: string;
  primary: boolean;
  status: "validated" | "unvalidated";
  type: ReceivedIdentityTypes;
  value: string;
};
