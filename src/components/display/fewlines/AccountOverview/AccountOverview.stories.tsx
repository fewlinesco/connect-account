import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import AccountOverview from "./AccountOverview";

export default { title: "pages/Account Overview", component: AccountOverview };

export const AccountPage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AccountOverview />
    </StoriesContainer>
  );
};
