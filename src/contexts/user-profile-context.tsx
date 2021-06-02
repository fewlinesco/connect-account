import { HttpStatus } from "@fwl/web";
import React from "react";
import useSWR, { SWRResponse } from "swr";

import { Profile } from "@src/@types/profile";
import { SWRError } from "@src/errors/errors";

type UserProfileContextDataStructure = {
  userProfileFetchedResponse?: SWRResponse<Profile, SWRError>;
  setUserProfileFetchedResponse: React.Dispatch<
    React.SetStateAction<SWRResponse<Profile, SWRError> | undefined>
  >;
};

const UserProfileContext =
  React.createContext<UserProfileContextDataStructure | undefined>(undefined);

const UserProfileProvider: React.FC<{
  children: React.ReactNode | undefined;
}> = ({ children }) => {
  const [userProfileFetchedResponse, setUserProfileFetchedResponse] =
    React.useState<SWRResponse<Profile, SWRError> | undefined>(undefined);

  const fetchedUserProfile = useSWR<Profile, SWRError>(
    `/api/profile/user-profile`,
    async (url) => {
      return await fetch(url).then(async (response) => {
        console.log({ response });
        if (!response.ok) {
          const error = new SWRError(
            "An error occurred while fetching the data.",
          );

          if (response.status === HttpStatus.NOT_FOUND) {
            error.statusCode = response.status;
            error.info = await response.json();
            return;
          }

          error.info = await response.json();
          error.statusCode = response.status;
          throw error;
        }

        return response.json();
      });
    },
    { shouldRetryOnError: false },
  );

  React.useEffect(() => {
    setUserProfileFetchedResponse(fetchedUserProfile);
  }, [fetchedUserProfile]);

  return (
    <UserProfileContext.Provider
      value={{ userProfileFetchedResponse, setUserProfileFetchedResponse }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

function useUserProfile(): UserProfileContextDataStructure {
  const context = React.useContext(UserProfileContext);

  if (context === undefined) {
    throw new Error(
      "useAlertMessages must be used within a AlertMessageProvider",
    );
  }

  return context;
}

export { UserProfileProvider, useUserProfile };
