import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./put-user";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { NoUserFoundError } from "@src/errors/errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

async function insertTemporaryIdentity(
  sub: string,
  temporaryIdentity: TemporaryIdentity,
): Promise<PutItemCommandOutput> {
  const user = await getDBUserFromSub(sub);

  if (user) {
    const isTemporaryIdentityInDb = user.temporary_identities.some(
      ({ value }) => value === temporaryIdentity.value,
    );

    let updatedUser;

    if (!isTemporaryIdentityInDb) {
      updatedUser = {
        ...user,
        temporary_identities: [...user.temporary_identities, temporaryIdentity],
      };
    } else {
      const updatedTemporaryIdentities = user.temporary_identities.map(
        (inDbTemporaryIdentity) => {
          if (inDbTemporaryIdentity.value === temporaryIdentity.value) {
            return temporaryIdentity;
          }
          return inDbTemporaryIdentity;
        },
      );

      updatedUser = {
        ...user,
        temporary_identities: updatedTemporaryIdentities,
      };
    }

    return await putUser(updatedUser);
  }

  throw new NoUserFoundError();
}

export { insertTemporaryIdentity };
