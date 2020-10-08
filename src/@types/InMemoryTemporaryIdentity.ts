import { IdentityTypes } from "@lib/@types";

export type InMemoryTemporaryIdentity = {
  value: string;
  type: IdentityTypes;
  expiresAt: number;
};
