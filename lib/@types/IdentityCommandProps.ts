import { IdentityTypes } from "./Identity";

export type IdentityCommandProps = {
  userId: string;
  type: IdentityTypes;
  value: string;
};
