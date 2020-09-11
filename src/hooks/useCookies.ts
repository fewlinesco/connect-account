import useSWR from "swr";

type CookiesValue = {
  data?: {
    userSub: string;
  };
  error?: Error;
};

export function useCookies(): CookiesValue {
  const { data, error } = useSWR("/api/user-sub", async (url) => {
    return fetch(url).then((response) => {
      return response.json();
    });
  });

  return { data, error };
}
