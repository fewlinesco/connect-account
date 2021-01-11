import React from "react";

import { RadioButton } from "./radio-button";

export default { title: "components/Radio Button", component: RadioButton };

export const CheckedRadioButton = (): JSX.Element => {
  return <RadioButton name="story" checked={true} />;
};

export const UncheckedRadioButton = (): JSX.Element => {
  return <RadioButton name="story" checked={false} />;
};
