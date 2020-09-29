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
