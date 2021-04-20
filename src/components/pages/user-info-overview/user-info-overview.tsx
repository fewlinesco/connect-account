import React from "react";

import { BoxedLink } from "../logins-overview/logins-overview";
import { Address, Profile } from "@src/@types/profile";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";

const UserInfoOverview: React.FC<{
  data?: {
    userInfo: {
      profile: Profile;
      addresses: Address[];
    };
  };
}> = ({ data }) => {
  return (
    <>
      <h2>Basic information</h2>
      <BoxedLink disableClick={false} href="#">
        <div>
          <p>Name</p>
          <p>
            {!data ? (
              <SkeletonTextLine fontSize={1.6} />
            ) : (
              data.userInfo.profile.name
            )}
          </p>
        </div>
        <RightChevron />
      </BoxedLink>
    </>
  );
};

export { UserInfoOverview };
