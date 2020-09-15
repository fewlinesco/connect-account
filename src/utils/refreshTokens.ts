import { HttpVerbs } from "../@types/HttpVerbs";
import { config } from "../config";
import { fetchJson } from "./fetchJson";

export async function refreshTokens(
  body: Record<string, string | number>,
): Promise<void> {
  const route = "/api/oauth/refresh-tokens";
  const absoluteURL = config.connectDomain + route;

  await fetchJson(absoluteURL, HttpVerbs.POST, body);
}
