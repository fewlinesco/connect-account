import { putUser } from "./putUser";
import { TemporaryIdentity } from "@src/@types/TemporaryIdentity";
import { NoUserFound } from "@src/clientErrors";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";

export async function removeTemporaryIdentity(
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

  throw new NoUserFound();
}
