import { HttpVerbs } from "src/@types/HttpVerbs";

export function customFetch(
  endpoint: string,
  method: HttpVerbs,
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
