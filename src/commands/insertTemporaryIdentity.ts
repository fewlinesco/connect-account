import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./putUser";
import { TemporaryIdentity } from "@src/@types/TemporaryIdentity";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";

export async function insertTemporaryIdentity(
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

  // TODO: better deal with this error
  throw new Error("User not found");
}
