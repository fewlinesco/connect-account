import type { MongoUser } from "@lib/@types/mongo/User";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import { config } from "@src/config";

export async function getUser(cookie: string): Promise<MongoUser> {
  const route = "/api/auth-connect/get-user";
  const absoluteURL = new URL(route, config.connectAccountURL).toString();

  const { user } = await fetch(absoluteURL, {
    method: HttpVerbs.GET,
    headers: { cookie },
  }).then((response) => response.json());

  return user;
}
