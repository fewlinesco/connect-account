import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { InputsRadio } from "./input-radio-button";

const InputsRadioButtons = (): JSX.Element => {
  const options = ["1st option", "2nd option"];
  const [optionValue, setOptionValue] = React.useState(options[0]);

  return (
    <StoriesContainer>
      <InputsRadio
        groupName="options"
        inputsValues={options}
        selectedInput={optionValue}
        onChange={({ target }) => {
          setOptionValue(target.value);
        }}
        isReady={true}
      />
    </StoriesContainer>
  );
};

export { InputsRadioButtons };
export default { title: "components/InputsRadio", component: InputsRadio };
