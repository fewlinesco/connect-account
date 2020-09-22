import React from "react";

import { Input } from "./Input";

export default { title: "Input", component: Input };

export const StandardInput = (): JSX.Element => {
  return <Input placeholder="input placeholder" />;
};
