import { IdentityTypes } from "@lib/@types";

export type TemporaryIdentity = {
  eventId: string;
  value: string;
  type: string;
  expiresAt: number;
  primary: boolean;
};

export type InMemoryTemporaryIdentity = {
  value: string;
  type: IdentityTypes;
  expiresAt: number;
  primary: boolean;
};
