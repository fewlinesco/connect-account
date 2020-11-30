import { TemporaryIdentity } from "@lib/@types";

export type DynamoUser = {
  sub: string;
  refresh_token: string;
  id_token?: string;
  temporary_identities?: TemporaryIdentity[];
};
