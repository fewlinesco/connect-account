import React from "react";

import { RadioButton } from "./RadioButton";

export default { title: "components/RadioButton", component: RadioButton };

export const CheckedRadioButton = (): JSX.Element => {
  return (
    <>
      <RadioButton name="story" checked={true} />
      <RadioButton name="story" checked={true} />
    </>
  );
};
