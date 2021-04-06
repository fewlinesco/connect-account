import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./put-user";
import { NoDBUserFoundError } from "@src/errors/errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

async function insertSudoModeTTL(sub: string): Promise<PutItemCommandOutput> {
  const user = await getDBUserFromSub(sub);

  if (user) {
    const updatedUser = {
      ...user,
      sudo: {
        ...user.sudo,
        sudo_mode_ttl: Date.now() + 300000,
      },
    };

    return await putUser(updatedUser);
  }

  throw new NoDBUserFoundError();
}

export { insertSudoModeTTL };
