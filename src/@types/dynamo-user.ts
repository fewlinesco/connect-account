import { TemporaryIdentity } from "./temporary-identity";

type DynamoUser = {
  sub: string;
  refresh_token: string;
  temporary_identities: TemporaryIdentity[];
};

export type { DynamoUser };
