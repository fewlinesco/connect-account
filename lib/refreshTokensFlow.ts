import { Db, ObjectId } from "mongodb";

import { HttpVerbs } from "../src/@types/HttpVerbs";
import { oauth2Client, config } from "../src/config";
import { fetchJson } from "../src/utils/fetchJson";

export async function refreshTokensFlow(
  refreshToken: string,
  mongoDb: Db,
  userDocumentId: string,
): Promise<void> {
  const payload = {
    client_id: oauth2Client.clientID,
    client_secret: oauth2Client.clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    scope: oauth2Client.scopes.join(" "),
  };

  const route = "oauth/token";
  const absoluteURL = config.connectProviderUrl + route;

  const { refresh_token, access_token } = await fetchJson(
    absoluteURL,
    HttpVerbs.POST,
    payload,
  ).then((response) => response.json());

  const { result } = await mongoDb
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userDocumentId) },
      { $set: { accessToken: access_token, refreshToken: refresh_token } },
    );

  if (result.n === 0) {
    throw new Error("Mongo update failed");
  }
}
