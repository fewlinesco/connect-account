import { IdentityTypes, Identity } from "@fewlines/connect-management";

const nonPrimaryEmailIdentity: Identity = {
  id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "validated",
  type: IdentityTypes.EMAIL,
  value: "test@test.test",
};

const primaryEmailIdentity: Identity = {
  id: "6tf443c1-530b-4982-878d-33f0def6a7cf",
  primary: true,
  status: "validated",
  type: IdentityTypes.EMAIL,
  value: "test4@test.test",
};

const unvalidatedEmailIdentity: Identity = {
  id: "77yt43c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "unvalidated",
  type: IdentityTypes.EMAIL,
  value: "test6@test.test",
};

const nonPrimaryPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "validated",
  type: IdentityTypes.PHONE,
  value: "0642424242",
};

const primaryPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: true,
  status: "validated",
  type: IdentityTypes.PHONE,
  value: "0642424243",
};

const unvalidatedPhoneIdentity: Identity = {
  id: "81z343c1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "unvalidated",
  type: IdentityTypes.PHONE,
  value: "0642424244",
};

const primarySocialIdentity: Identity = {
  id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
  primary: true,
  status: "validated",
  type: IdentityTypes.GITHUB,
  value: "",
};

const nonPrimarySocialIdentity: Identity = {
  id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
  primary: false,
  status: "validated",
  type: IdentityTypes.FACEBOOK,
  value: "",
};

export {
  nonPrimaryEmailIdentity,
  primaryEmailIdentity,
  unvalidatedEmailIdentity,
  nonPrimaryPhoneIdentity,
  primaryPhoneIdentity,
  unvalidatedPhoneIdentity,
  primarySocialIdentity,
  nonPrimarySocialIdentity,
};
