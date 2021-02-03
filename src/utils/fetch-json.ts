import { HttpVerbs } from "@src/@types/core/http-verbs";

export function fetchJson(
  endpoint: string,
  method: Exclude<HttpVerbs, HttpVerbs.GET>,
  body: Record<string, unknown>,
): Promise<Response> {
  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
