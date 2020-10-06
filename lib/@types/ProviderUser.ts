import { Identity } from "../../src/@types/Identity";

export type ProviderUser = {
  id: string;
  name: string;
  user: {
    id: string;
    identities: Identity[];
  };
};

export type SingleIdentityProviderUser = {
  id: string;
  name: string;
  user: {
    id: string;
    identity: Identity | null;
  };
};
