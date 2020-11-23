import { putUser } from "./putUser";
import { OAuth2UserInfo } from "@src/@types/dynamodb/Users";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";

export async function getAndPutUser({
  sub,
  refresh_token,
  id_token,
}: OAuth2UserInfo): Promise<void> {
  const initialUser = await getDBUserFromSub(sub);

  let user = initialUser.Item;

  if (!initialUser.Item) {
    user = {
      sub: {
        S: sub,
      },
      refresh_token: {
        S: refresh_token,
      },
    };

    if (id_token) {
      user = {
        id_token: {
          S: id_token,
        },
        ...user,
      };
    }
  }

  putUser(user);
}
