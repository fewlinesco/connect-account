import React from "react";

import { Address, Profile } from "@src/@types/profile";

const UserInfoOverview: React.FC<{
  data?: {
    userInfo: {
      profile: Profile;
      addresses: Address[];
    };
  };
}> = () => {
  return <></>;
};

export { UserInfoOverview };
