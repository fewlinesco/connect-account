import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { Locale } from "./Locale";

export default { title: "pages/Locale", component: Locale };

export const StandardLocale = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Locale />
    </StoriesContainer>
  );
};
