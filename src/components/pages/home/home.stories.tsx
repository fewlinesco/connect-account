import React from "react";

import { StoriesContainer } from "../../containers/stories-container";
import { Home } from "./home";

const HomePage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Home authorizeURL={"#"} providerName={"Fewlines"} />
    </StoriesContainer>
  );
};

export { HomePage };
export default { title: "pages/Home", component: Home };
