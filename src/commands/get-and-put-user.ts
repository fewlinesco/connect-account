import { putUser } from "./put-user";
import { DynamoUser } from "@src/@types/dynamo-user";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

type OAuth2UserInfo = {
  sub: string;
  refresh_token: string;
  id_token?: string;
};

async function getAndPutUser(
  { sub, refresh_token }: OAuth2UserInfo,
  currentUserData?: DynamoUser,
): Promise<void> {
  const inDBUser = currentUserData
    ? currentUserData
    : await getDBUserFromSub(sub);

  if (!inDBUser) {
    const user = {
      sub,
      refresh_token,
    };

    putUser(user);
    return;
  }

  const user = {
    ...inDBUser,
    sub,
    refresh_token,
  };

  await putUser(user);
  return;
}

export { getAndPutUser };
