import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./putUser";
import { OAuth2UserInfo } from "@src/@types/dynamodb/Users";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";

export async function getAndPutUser({
  sub,
  refresh_token,
  id_token,
}: OAuth2UserInfo): Promise<PutItemCommandOutput> {
  const inDBUser = await getDBUserFromSub(sub);

  if (!inDBUser) {
    const user = {
      sub,
      refresh_token,
      id_token,
    };

    return putUser(user);
  }

  const user = {
    ...inDBUser,
    sub,
    refresh_token,
    id_token,
  };

  return putUser(user);
}
