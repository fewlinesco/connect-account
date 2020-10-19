import React from "react";

import { Triangle } from "./Triangle";

export default { title: "icons/Triangle", component: Triangle };

export const StandardTriangle = (): JSX.Element => {
  return <Triangle rotate={false} />;
};

export const RotatedTriangle = (): JSX.Element => {
  return <Triangle rotate={true} />;
};
