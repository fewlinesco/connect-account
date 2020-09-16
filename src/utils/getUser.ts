import { HttpVerbs } from "@src/@types/HttpVerbs";
import type { MongoUser } from "@src/@types/mongo/User";
import { config } from "@src/config";

export async function getUser(cookie: string): Promise<MongoUser> {
  const route = "/api/auth-connect/get-user";
  const absoluteURL = new URL(route, config.connectProviderUrl).toString();

  const { user } = await fetch(absoluteURL, {
    method: HttpVerbs.GET,
    headers: { cookie },
  }).then((response) => response.json());

  return user;
}
