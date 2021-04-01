import React from "react";
import { SWRConfig } from "swr";

import { Security } from "./security";

const PasswordSet = (): JSX.Element => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        fetcher: () => {
          return { isPasswordSet: true };
        },
      }}
    >
      <Security />
    </SWRConfig>
  );
};

const PasswordNotSet = (): JSX.Element => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        fetcher: () => {
          return { isPasswordSet: false };
        },
      }}
    >
      <Security />
    </SWRConfig>
  );
};

export { PasswordSet, PasswordNotSet };
export default { title: "pages/Security", component: Security };
