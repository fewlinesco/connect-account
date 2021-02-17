import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./put-user";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { NoUserFoundError } from "@src/errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

async function insertTemporaryIdentity(
  sub: string,
  temporaryIdentity: TemporaryIdentity,
): Promise<PutItemCommandOutput> {
  const user = await getDBUserFromSub(sub);

  if (user) {
    const updatedUser = {
      ...user,
      temporary_identities: [...user.temporary_identities, temporaryIdentity],
    };

    return putUser(updatedUser);
  }

  throw new NoUserFoundError();
}

export { insertTemporaryIdentity };
