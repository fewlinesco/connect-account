import type { MongoUser } from "@lib/@types/mongo/User";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import { config } from "@src/config";

export async function getUser(cookie: string): Promise<MongoUser> {
  const route = "/api/auth-connect/get-user";
  const absoluteURL = new URL(route, config.connectDomain).toString();

  console.log("Flag: before first mocked fetch");

  const { user } = await fetch(absoluteURL, {
    method: HttpVerbs.GET,
    headers: { cookie },
  }).then((response) => {
    console.log(
      "First mock response, should be 299d268e-3e19-4486-9be7-29c539d241ac",
      response,
    );
    return response.json();
  });

  return user;
}
