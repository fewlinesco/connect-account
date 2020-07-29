import { HttpVerbs } from "src/@types/HttpVerbs";

type Body = {
  [key: string]: string;
};

export function customFetch(
  endpoint: string,
  method: HttpVerbs,
  body: Body,
): Promise<Response> {
  return fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
