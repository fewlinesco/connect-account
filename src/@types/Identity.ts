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

export type Identity = {
  id: string;
  primary: boolean;
  status: "validated" | "unvalidated";
  type: IdentityTypes;
  value: string;
};
