import { HttpVerbs } from "@src/@types/HttpVerbs";
import { config } from "@src/config";
import { fetchJson } from "@src/utils/fetchJson";

export async function refreshTokens(
  body: Record<string, string | number>,
): Promise<void> {
  const route = "/api/oauth/refresh-tokens";
  const absoluteURL = config.connectDomain + route;

  await fetchJson(absoluteURL, HttpVerbs.POST, body);
}
