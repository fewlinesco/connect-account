import React from "react";

import { IdentityContainer } from "./IdentityContainer";

export default { title: "IdentityContainer", component: IdentityContainer };

export const StandardIdentityContainer = (): JSX.Element => {
  return <IdentityContainer>emailaddress@mail.test</IdentityContainer>;
};
