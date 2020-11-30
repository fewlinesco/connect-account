import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./putUser";
import { DynamoUser } from "@src/@types/DynamoUser";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";

type OAuth2UserInfo = {
  sub: string;
  refresh_token: string;
  id_token?: string;
};

// TODO: Handle id_token in user
export async function getAndPutUser(
  { sub, refresh_token, id_token }: OAuth2UserInfo,
  currentUserData?: DynamoUser,
): Promise<PutItemCommandOutput> {
  const inDBUser = currentUserData
    ? currentUserData
    : await getDBUserFromSub(sub);

  if (!inDBUser) {
    const user = {
      sub,
      refresh_token,
    };

    return id_token ? putUser({ ...user, id_token }) : putUser(user);
  }

  const user = {
    ...inDBUser,
    sub,
    refresh_token,
  };

  return id_token ? putUser({ ...user, id_token }) : putUser(user);
}
