import { putUser } from "./put-user";
import { SudoEventId } from "@src/@types/dynamo-user";
import { NoUserFoundError } from "@src/errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

async function removeExpiredSudoEventIds(
  sub: string,
  sudoEventIds: SudoEventId[],
): Promise<void> {
  const user = await getDBUserFromSub(sub);

  if (user) {
    const updatedUser = {
      ...user,
      sudo_event_ids: sudoEventIds,
    };

    await putUser(updatedUser);
    return;
  }

  throw new NoUserFoundError();
}

export { removeExpiredSudoEventIds };
