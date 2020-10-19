import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import Home from "./Home";

export default { title: "pages/Home", component: Home };

export const HomePage = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Home authorizeURL={"#"} />
    </StoriesContainer>
  );
};
