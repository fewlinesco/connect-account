function fetchJson(
  endpoint: string,
  method: "POST" | "DELETE" | "PATCH" | "PUT",
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

export { fetchJson };
