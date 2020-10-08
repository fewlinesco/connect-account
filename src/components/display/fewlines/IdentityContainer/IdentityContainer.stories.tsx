import React from "react";

import { Container } from "../Container";
import { IdentityContainer } from "./IdentityContainer";

export default {
  title: "components/IdentityContainer",
  component: IdentityContainer,
};

export const StandardIdentityContainer = (): JSX.Element => {
  return (
    <Container>
      <IdentityContainer>emailaddress@mail.test</IdentityContainer>
    </Container>
  );
};
