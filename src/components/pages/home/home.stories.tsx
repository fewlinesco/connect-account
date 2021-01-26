import React from "react";

import { StoriesContainer } from "../../containers/stories-container";
import { Home } from "./home";

export default { title: "pages/Home", component: Home };

export const HomePage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Home authorizeURL={"#"} providerName={"Fewlines"} />
    </StoriesContainer>
  );
};
