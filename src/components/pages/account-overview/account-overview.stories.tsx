import React from "react";

import { StoriesContainer } from "../../containers/stories-container";
import { AccountOverview } from "./account-overview";

const AccountPage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <AccountOverview />
    </StoriesContainer>
  );
};

export { AccountPage };
export default { title: "pages/Account Overview", component: AccountOverview };
