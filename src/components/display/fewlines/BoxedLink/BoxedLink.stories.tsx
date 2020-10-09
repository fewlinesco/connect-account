import React from "react";

import { Container } from "../Container";
import { BoxedLink } from "./BoxedLink";

export default { title: "components/BoxedLink", component: BoxedLink };

export const StandardBoxedLink = (): JSX.Element => {
  return (
    <Container>
      <BoxedLink
        value={"emailaddress@mail.test"}
        primary={true}
        status="validated"
      />
    </Container>
  );
};
