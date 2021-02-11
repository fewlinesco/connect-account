import React from "react";

import { StoriesContainer } from "../../containers/stories-container";
import { Locale } from "./locale";

const StandardLocale = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Locale />
    </StoriesContainer>
  );
};

export { StandardLocale };
export default { title: "pages/Locale", component: Locale };
