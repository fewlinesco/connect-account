import React from "react";

import { Triangle } from "./triangle";

const StandardTriangle = (): JSX.Element => {
  return <Triangle rotate={false} />;
};

const RotatedTriangle = (): JSX.Element => {
  return <Triangle rotate={true} />;
};

export { StandardTriangle, RotatedTriangle };
export default { title: "icons/Triangle", component: Triangle };
