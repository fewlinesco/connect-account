import type { Method } from "@src/@types/Method";

export function fetchJson(
  endpoint: string,
  method: Method,
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
