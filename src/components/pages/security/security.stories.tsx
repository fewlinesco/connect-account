import React from "react";

import { Security } from "./security";

const PasswordSet = (): JSX.Element => {
  return <Security isPasswordSet={true} />;
};

const PasswordNotSet = (): JSX.Element => {
  return <Security isPasswordSet={false} />;
};

export { PasswordSet, PasswordNotSet };
export default { title: "pages/Security", component: Security };
