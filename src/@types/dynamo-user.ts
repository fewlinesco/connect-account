import { TemporaryIdentity } from "./temporary-identity";

type SudoEventId = {
  event_id: string;
  expires_at: number;
};

type DynamoUser = {
  sub: string;
  refresh_token: string;
  temporary_identities: TemporaryIdentity[];
  sudo_event_ids: SudoEventId[];
};

export type { DynamoUser, SudoEventId };
