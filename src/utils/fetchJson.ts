import { Method } from "../@types/Method";

export function fetchJson(
  endpoint: string,
  method: Method,
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
