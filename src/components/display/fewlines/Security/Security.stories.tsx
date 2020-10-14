import React from "react";

import Security from "./Security";

export default { title: "pages/Security", component: Security };

export const PasswordNotSet = (): JSX.Element => {
  return <Security isPasswordSet={false} />;
};

export const PasswordSet = (): JSX.Element => {
  return <Security isPasswordSet={true} />;
};
