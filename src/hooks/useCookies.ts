import useSWR from "swr";

import { UserCookie } from "@src/@types/UserCookie";

type CookiesValue = {
  data?: UserCookie;
  error?: Error;
};

export function useUserCookie(): CookiesValue {
  const { data, error } = useSWR(
    "/api/auth-connect/user-cookie",
    async (url) => {
      return fetch(url).then((response) => {
        return response.json();
      });
    },
  );

  return { data, error };
}
