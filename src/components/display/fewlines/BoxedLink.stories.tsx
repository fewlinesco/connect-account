import React from "react";

import { BoxedLink } from "./BoxedLink";

export default { title: "BoxedLink", component: BoxedLink };

export const StandardBoxedLink = (): JSX.Element => {
  return (
    <BoxedLink
      value={"emailaddress@mail.test"}
      primary={true}
      status={"validated"}
    />
  );
};
