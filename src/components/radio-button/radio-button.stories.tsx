import React from "react";

import { RadioButton } from "./radio-button";

const CheckedRadioButton = (): JSX.Element => {
  return <RadioButton name="story" checked={true} />;
};

const UncheckedRadioButton = (): JSX.Element => {
  return <RadioButton name="story" checked={false} />;
};

export { CheckedRadioButton, UncheckedRadioButton };
export default { title: "components/Radio Button", component: RadioButton };
