import { TemporaryIdentity } from "./temporary-identity";

export type DynamoUser = {
  sub: string;
  refresh_token: string;
  temporary_identities: TemporaryIdentity[];
};
