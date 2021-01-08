import { HttpVerbs } from "@src/@types/core/http-verbs";
import { RefreshTokenResponse } from "@src/@types/oauth2/oauth2-tokens";
import { oauth2Client, config } from "@src/config";
import { fetchJson } from "@src/utils/fetchJson";

export async function refreshTokensFlow(
  refresh_token: string,
): Promise<RefreshTokenResponse> {
  const payload = {
    client_id: oauth2Client.clientID,
    client_secret: oauth2Client.clientSecret,
    refresh_token,
    grant_type: "refresh_token",
    scope: oauth2Client.scopes.join(" "),
  };

  const route = "oauth/token";
  const absoluteURL = new URL(route, config.connectProviderUrl).toString();

  return fetchJson(absoluteURL, HttpVerbs.POST, payload).then((response) =>
    response.json(),
  );
}
