import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { Input } from "./input";

export default { title: "components/Input", component: Input };

export const StandardInput = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Input placeholder="input placeholder" />
    </StoriesContainer>
  );
};
