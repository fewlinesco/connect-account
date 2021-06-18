import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

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
): Promise<PutItemCommandOutput> {
  const inDBUser = currentUserData
    ? currentUserData
    : await getDBUserFromSub(sub);

  console.log({ inDBUser });

  if (!inDBUser) {
    return putUser({
      sub,
      refresh_token,
    });
  }

  return putUser({
    ...inDBUser,
    sub,
    refresh_token,
  });
}

export { getAndPutUser };
