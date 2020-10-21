import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import AccountOverview from "./AccountOverview";

export default { title: "pages/AccountOverview", component: AccountOverview };

export const AccountPage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AccountOverview />
    </StoriesContainer>
  );
};
