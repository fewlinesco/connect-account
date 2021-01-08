import React from "react";

import { StoriesContainer } from "../display/fewlines/StoriesContainer";
import { Input } from "./input";

export default { title: "components/Input", component: Input };

export const StandardInput = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Input placeholder="input placeholder" />
    </StoriesContainer>
  );
};
