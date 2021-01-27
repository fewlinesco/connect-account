import React from "react";

import { StoriesContainer } from "../../containers/stories-container";
import { Locale } from "./locale";

export default { title: "pages/Locale", component: Locale };

export const StandardLocale = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Locale />
    </StoriesContainer>
  );
};
