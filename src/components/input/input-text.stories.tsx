import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { InputText } from "./input-text";

const StandardInputText = (): JSX.Element => {
  const [emailValue, setEmailValue] = React.useState("");

  return (
    <StoriesContainer>
      <InputText
        type="email"
        name="value"
        value={emailValue}
        placeholder={`Enter your email`}
        onChange={(value) => {
          setEmailValue(value);
        }}
        label="New email address *"
      />
    </StoriesContainer>
  );
};

export { StandardInputText };
export default { title: "components/InputText", component: InputText };
