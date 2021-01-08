import React from "react";

import { StoriesContainer } from "../display/fewlines/StoriesContainer";
import { Home } from "./home";

export default { title: "pages/Home", component: Home };

export const HomePage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Home authorizeURL={"#"} providerName={"Fewlines"} />
    </StoriesContainer>
  );
};
