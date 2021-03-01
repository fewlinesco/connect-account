import { IdentityTypes } from "@fewlines/connect-management";

type TemporaryIdentity = {
  eventIds: string[];
  value: string;
  type: string;
  expiresAt: number;
  primary: boolean;
  identityToUpdateId?: string;
};

type InMemoryTemporaryIdentity = {
  value: string;
  type: IdentityTypes;
  expiresAt: number;
  primary: boolean;
};

export type { TemporaryIdentity, InMemoryTemporaryIdentity };
