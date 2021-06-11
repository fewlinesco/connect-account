import React from "react";
import useSWR from "swr";

import { SWRError } from "@src/errors/errors";

const UserProfileContext = React.createContext<{ locale: string } | undefined>(
  undefined,
);

const UserLocaleProvider: React.FC<{
  children: React.ReactNode | undefined;
}> = ({ children }) => {
  const [locale, setLocale] = React.useState<string>("en");
  const { data: fetchedLocale } = useSWR<string, SWRError>(`/api/locale`);

  React.useEffect(() => {
    fetchedLocale && setLocale(fetchedLocale);
  }, [fetchedLocale]);

  return (
    <UserProfileContext.Provider value={{ locale }}>
      {children}
    </UserProfileContext.Provider>
  );
};

function useUserLocale(): { locale: string } {
  const context = React.useContext(UserProfileContext);

  if (context === undefined) {
    throw new Error("useUserLocale must be used within a UserLocaleProvider");
  }

  return context;
}

export { UserLocaleProvider, useUserLocale };
