import React from "react";

import { StoriesContainer } from "../display/fewlines/StoriesContainer";
import { Locale } from "./locale";

export default { title: "pages/Locale", component: Locale };

export const StandardLocale = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Locale />
    </StoriesContainer>
  );
};
