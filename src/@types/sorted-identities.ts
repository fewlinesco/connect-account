import { Identity } from "@fewlines/connect-management";

export type SortedIdentities = {
  phoneIdentities: Identity[];
  emailIdentities: Identity[];
  socialIdentities: Identity[];
};
