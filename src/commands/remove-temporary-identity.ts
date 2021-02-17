import { putUser } from "./put-user";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { NoUserFoundError } from "@src/errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

async function removeTemporaryIdentity(
  sub: string,
  temporaryIdentity: TemporaryIdentity,
): Promise<void> {
  const user = await getDBUserFromSub(sub);

  if (user) {
    const updatedUser = {
      ...user,
      temporary_identities: user.temporary_identities.filter(
        (identity) => identity.eventId !== temporaryIdentity.eventId,
      ),
    };

    await putUser(updatedUser);
    return;
  }

  throw new NoUserFoundError();
}

export { removeTemporaryIdentity };
