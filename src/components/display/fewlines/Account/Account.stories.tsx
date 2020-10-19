import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import Account from "./Account";

export default { title: "pages/Account", component: Account };

export const AccountPage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Account />
    </StoriesContainer>
  );
};
