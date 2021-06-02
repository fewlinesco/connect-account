import React from "react";

import { Profile } from "@src/@types/profile";

type UserProfileContextDataStructure = {
  userProfile: Profile | undefined;
  setUserProfile: React.Dispatch<React.SetStateAction<Profile | undefined>>;
};

const UserProfileContext =
  React.createContext<UserProfileContextDataStructure | undefined>(undefined);

const UserProfileProvider: React.FC<{
  children: React.ReactNode | undefined;
}> = ({ children }) => {
  const [userProfile, setUserProfile] =
    React.useState<Profile | undefined>(undefined);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
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
