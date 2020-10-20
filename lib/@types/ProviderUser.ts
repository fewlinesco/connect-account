import { Identity } from "@lib/@types";

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

export type ProviderUserPasswordSet = {
  id: string;
  name: string;
  user: {
    id: string;
    passwords: {
      available: boolean;
    };
  };
};

export type User = {
  id: string;
};

export type CreateOrUpdatePasswordInput = {
  cleartextPassword: string;
  userId: string;
};
