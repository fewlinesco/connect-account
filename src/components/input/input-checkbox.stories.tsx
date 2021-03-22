import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { InputCheckbox } from "./input-checkbox";

const StandardInputCheckbox = (): JSX.Element => {
  return (
    <StoriesContainer>
      <InputCheckbox
        name="stories"
        onChange={() => {
          return;
        }}
        label="Checkbox story"
      />
    </StoriesContainer>
  );
};

export { StandardInputCheckbox };
export default { title: "components/InputCheckbox", component: InputCheckbox };
