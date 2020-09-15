import { HttpVerbs } from "../@types/HttpVerbs";
import type { MongoUser } from "../@types/mongo/User";
import { config } from "../config";

export async function getUser(cookie: string): Promise<MongoUser> {
  const route = "/api/auth-connect/get-user";
  const absoluteURL = config.connectDomain + route;

  const { user } = await fetch(absoluteURL, {
    method: HttpVerbs.GET,
    headers: { cookie },
  }).then((response) => response.json());

  return user;
}
