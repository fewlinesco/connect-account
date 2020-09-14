import { HttpVerbs } from "../@types/HttpVerbs";
import { oauth2Client, config } from "../config";
import { fetchJson } from "./fetchJson";

export async function refreshTokenFlow(refreshToken: string): Promise<void> {
  const payload = {
    client_id: oauth2Client.clientID,
    client_secret: oauth2Client.clientSecret,
    refresh_token: refreshToken,
    grant_type: "authorization_code",
    scopes: oauth2Client.scopes.join(" "),
  };

  console.log("refreshTokenFlow payload", payload);

  const route = "/oauth/token";
  const absoluteURL = config.connectProviderUrl + route;

  console.log("hello");

  const jsonResponse = await fetchJson(
    absoluteURL,
    HttpVerbs.POST,
    payload,
  ).then((response) => response.json());

  return console.log("refreshTokenFlow response", jsonResponse);

  // collection.updateOne(_id, { refresh });
}
