import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./put-user";
import { SudoEventId } from "@src/@types/dynamo-user";
import { NoDBUserFoundError } from "@src/errors/errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

async function insertSudoEventId(
  sub: string,
  sudoEventId: SudoEventId,
): Promise<PutItemCommandOutput> {
  const user = await getDBUserFromSub(sub);

  if (user) {
    const updatedUser = {
      ...user,
      sudo: {
        ...user.sudo,
        sudo_event_ids: [...user.sudo.sudo_event_ids, sudoEventId],
      },
    };

    console.log("updatedUser: ", updatedUser);

    return await putUser(updatedUser);
  }

  throw new NoDBUserFoundError();
}

export { insertSudoEventId };
