import { Identity, IdentityInput } from "@lib/@types";

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

export type ProviderUserId = {
  user: {
    id: string;
  };
};

export type User = {
  id: string;
};

export type CreateOrUpdatePasswordInput = {
  cleartextPassword: string;
  userId: string;
};

export type CreateUserWithIdentitiesInput = {
  identities: IdentityInput[];
  localeCode: string;
};

export type DeleteUserInput = {
  userId: string;
};

export type DeleteUserStatus = {
  status: string;
};
