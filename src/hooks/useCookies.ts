import useSWR from "swr";

type CookiesValue = {
  data?: {
    userId: string;
  };
  error?: Error;
};

export function useCookies(): CookiesValue {
  const { data, error } = useSWR("/api/user-id", async (url) => {
    return fetch(url).then((response) => response.json());
  });

  return { data, error };
}
