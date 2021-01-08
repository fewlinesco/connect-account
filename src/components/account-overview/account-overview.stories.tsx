import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { AccountOverview } from "./account-overview";

export default { title: "pages/Account Overview", component: AccountOverview };

export const AccountPage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AccountOverview />
    </StoriesContainer>
  );
};
