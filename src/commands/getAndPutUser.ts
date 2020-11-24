import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./putUser";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";

type OAuth2UserInfo = {
  sub: string;
  refresh_token: string;
  id_token?: string;
};

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
