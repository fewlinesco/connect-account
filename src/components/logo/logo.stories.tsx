import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { Logo } from "./logo";

const StandardInput = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Logo />
    </StoriesContainer>
  );
};

export { StandardInput };
export default { title: "components/Logo", component: Logo };
