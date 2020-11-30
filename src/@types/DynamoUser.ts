import { TemporaryIdentity } from "./TemporaryIdentity";

export type DynamoUser = {
  sub: string;
  refresh_token: string;
  temporary_identities: TemporaryIdentity[];
};
