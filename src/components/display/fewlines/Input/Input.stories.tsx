import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { Input } from "./Input";

export default { title: "components/Input", component: Input };

export const StandardInput = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Input placeholder="input placeholder" />
    </StoriesContainer>
  );
};
