export async function SWRFetcher<T>(url: string): Promise<T> {
  return fetch(url).then((response) => response.json());
}
