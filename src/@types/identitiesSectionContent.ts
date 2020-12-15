import { Identity } from "@lib/@types";

export type IdentitiesSectionContent = {
  title: string;
  noIdentityMessage: string;
  addNewIdentityMessage?: string;
  identitiesList: Identity[];
};
