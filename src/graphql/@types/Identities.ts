export enum IdentityTypes {
  EMAIL,
  FACEBOOK,
  GITHUB,
  GOOGLE,
  KAKAO_TALK,
  LINE,
  PHONE,
  PROVIDER,
  STRAVA,
  VKONTAKTE,
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
