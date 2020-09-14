import { Db, ObjectId } from "mongodb";

import { HttpVerbs } from "../@types/HttpVerbs";
import { oauth2Client, config } from "../config";
import { fetchJson } from "./fetchJson";

export async function refreshTokenFlow(
  refreshToken: string,
  mongoDb: Db,
  userDocumentId: string,
): Promise<{ ok: number; n: number; nModified: number }> {
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

  const updateResult = await mongoDb
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userDocumentId) },
      { $set: { accessToken: access_token, refreshToken: refresh_token } },
    );

  return updateResult.result;
}
