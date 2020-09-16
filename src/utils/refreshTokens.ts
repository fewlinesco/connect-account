import { HttpVerbs } from "@src/@types/HttpVerbs";
import { config } from "@src/config";
import { fetchJson } from "@src/utils/fetchJson";

export async function refreshTokens(
  body: Record<string, string | number>,
): Promise<{ access_token: string }> {
  const route = "/api/oauth/refresh-tokens";
  const absoluteURL = new URL(route, config.connectProviderUrl).toString();

  return await fetchJson(absoluteURL, HttpVerbs.POST, body).then((response) =>
    response.json(),
  );
}
