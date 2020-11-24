import { getAndPutUser } from "./getAndPutUser";

export async function updateAccessAndRefreshTokens(
  sub: string,
  refresh_token: string,
): Promise<void> {
  await getAndPutUser({ sub, refresh_token });
}
