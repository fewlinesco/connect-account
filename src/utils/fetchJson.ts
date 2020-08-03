import { Method } from "src/@types/Method";

type Methods = Exclude<HttpVerbs, HttpVerbs.GET>;

export function fetchJson(
  endpoint: string,
  method: Methods,
  body: Record<string, string | number>,
): Promise<Response> {
  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
