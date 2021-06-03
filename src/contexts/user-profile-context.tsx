import { HttpStatus } from "@fwl/web";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import { Profile } from "@src/@types/profile";
import { SWRError } from "@src/errors/errors";

type UserProfileContextDataStructure = {
  userProfile?: Profile;
};

const UserProfileContext =
  React.createContext<UserProfileContextDataStructure | undefined>(undefined);

const UserProfileProvider: React.FC<{
  children: React.ReactNode | undefined;
}> = ({ children }) => {
  const [userProfile, setUserProfile] =
    React.useState<Profile | undefined>(undefined);

  const router = useRouter();

  const fetchedUserProfile = useSWR<Profile, SWRError>(
    `/api/profile/user-profile`,
    async (url) => {
      return await fetch(url).then(async (response) => {
        if (!response.ok) {
          const error = new SWRError(
            "An error occurred while fetching the data.",
          );

          if (response.status === HttpStatus.NOT_FOUND) {
            if (router.pathname === "/account/profile") {
              router && router.replace("/account/profile/user-profile/new");
              return response.json();
            }

            error.info = await response.json();
            error.statusCode = response.status;
            return error;
          }

          error.info = await response.json();
          error.statusCode = response.status;
          throw error;
        }

        return response.json();
      });
    },
  );

  React.useEffect(() => {
    setUserProfile(fetchedUserProfile.data);
  }, [fetchedUserProfile]);

  return (
    <UserProfileContext.Provider value={{ userProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

function useUserProfile(): UserProfileContextDataStructure {
  const context = React.useContext(UserProfileContext);

  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }

  return context;
}

export { UserProfileProvider, useUserProfile };
