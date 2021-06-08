import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

import { putUser } from "./put-user";
import { DynamoUser } from "@src/@types/dynamo-user";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

type OAuth2UserInfo = {
  sub: string;
  refresh_token: string;
  id_token?: string;
  locale?: string;
};

async function getAndPutUser(
  { sub, refresh_token, locale }: OAuth2UserInfo,
  currentUserData?: DynamoUser,
): Promise<PutItemCommandOutput> {
  const inDBUser = currentUserData
    ? currentUserData
    : await getDBUserFromSub(sub);

  if (!inDBUser) {
    return putUser({
      sub,
      refresh_token,
      locale: "en",
    });
  }

  return putUser({
    ...inDBUser,
    sub,
    refresh_token,
    locale,
  });
}

export { getAndPutUser };
