export enum IdentityTypes {
  APPLE = "APPLE",
  EMAIL = "EMAIL",
  FACEBOOK = "FACEBOOK",
  GITHUB = "GITHUB",
  GOOGLE = "GOOGLE",
  KAKAO_TALK = "KAKAO_TALK",
  LINE = "LINE",
  NAVER = "NAVER",
  PAYPAL = "PAYPAL",
  PHONE = "PHONE",
  PROVIDER = "PROVIDER",
  STRAVA = "STRAVA",
  VKONTAKTE = "VKONTAKTE",
  MICROSOFT = "MICROSOFT",
  DECATHLON = "DECATHLON",
}

export enum IdentityStatus {
  UNVALIDATED = "UNVALIDATED",
  VALIDATED = "VALIDATED",
}

export type IdentityInput = {
  status?: IdentityStatus;
  type: IdentityTypes;
  value: string;
};

export type Identity = {
  id: string;
  primary: boolean;
  status: "validated" | "unvalidated";
  type: IdentityTypes;
  value: string;
};

export type IdentityValueInput = {
  value: string;
};
