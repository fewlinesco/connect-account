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
  // An identity UUID
  id: string;
  // Wether the identity is the primary one
  primary: boolean;
  // Identity status (i.e. validated, unvalidated)
  status: string;
  // Type of identity (e.g. email, phone)
  type: IdentityTypes;
  // Identity value (e.g. john@doe.com)
  value: string;
};
