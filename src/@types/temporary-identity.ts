import { IdentityTypes } from "@fewlines/connect-management";

export type TemporaryIdentity = {
  eventId: string;
  value: string;
  type: string;
  expiresAt: number;
  primary: boolean;
  identityToUpdateId?: string;
};

export type InMemoryTemporaryIdentity = {
  value: string;
  type: IdentityTypes;
  expiresAt: number;
  primary: boolean;
};
