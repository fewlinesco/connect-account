import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { Languages } from "./Languages";

export default { title: "pages/Languages", component: Languages };

export const StandardLanguages = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Languages />
    </StoriesContainer>
  );
};
