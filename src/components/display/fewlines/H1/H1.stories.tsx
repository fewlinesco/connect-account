import React from "react";

import { Container } from "../Container";
import { H1 } from "./H1";

export default { title: "components/H1", component: H1 };

export const StandardH1 = (): JSX.Element => {
  return (
    <Container>
      <H1>Logins</H1>
    </Container>
  );
};
