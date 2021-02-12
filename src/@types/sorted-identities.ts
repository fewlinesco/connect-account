import { Identity } from "@fewlines/connect-management";

type SortedIdentities = {
  phoneIdentities: Identity[];
  emailIdentities: Identity[];
  socialIdentities: Identity[];
};

export type { SortedIdentities };
