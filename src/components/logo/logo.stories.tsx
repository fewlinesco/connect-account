import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { Logo } from "./logo";

const StandardLogo = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Logo />
    </StoriesContainer>
  );
};

export { StandardLogo };
export default { title: "components/Logo", component: Logo };
