import React from "react";

import { Container } from "../Container";
import { H2 } from "./H2";

export default { title: "components/H2", component: H2 };

export const StandardH1 = (): JSX.Element => {
  return (
    <Container>
      <H2>Logins</H2>
    </Container>
  );
};
