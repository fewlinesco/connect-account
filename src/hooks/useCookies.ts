import useSWR from "swr";

type CookiesValue = {
  data?: {
    userDocumentId: string;
  };
  error?: Error;
};

export function useCookies(): CookiesValue {
  const { data, error } = useSWR(
    "api/auth-connect/user-document-id",
    async (url) => {
      return fetch(url).then((response) => {
        return response.json();
      });
    },
  );

  return { data, error };
}
