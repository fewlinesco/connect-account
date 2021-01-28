import { IdentityTypes, Identity } from "@fewlines/connect-management";

export const nonPrimaryEmailIdentity: Identity = {
  id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "validated",
  type: IdentityTypes.EMAIL,
  value: "Test@test.test",
};

export const primaryEmailIdentity: Identity = {
  id: "6tf443c1-530b-4982-878d-33f0def6a7cf",
  primary: true,
  status: "validated",
  type: IdentityTypes.EMAIL,
  value: "test4@test.test",
};

export const unvalidatedEmailIdentity: Identity = {
  id: "77yt43c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "unvalidated",
  type: IdentityTypes.EMAIL,
  value: "test6@test.test",
};

export const nonPrimaryPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "validated",
  type: IdentityTypes.PHONE,
  value: "0642424242",
};

export const primaryPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: true,
  status: "validated",
  type: IdentityTypes.PHONE,
  value: "0642424243",
};

export const unvalidatedPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "unvalidated",
  type: IdentityTypes.PHONE,
  value: "0642424244",
};

export const primarySocialIdentity: Identity = {
  id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
  primary: true,
  status: "validated",
  type: IdentityTypes.GITHUB,
  value: "",
};

export const nonPrimarySocialIdentity: Identity = {
  id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "validated",
  type: IdentityTypes.FACEBOOK,
  value: "",
};
