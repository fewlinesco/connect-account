import React from "react";
import styled from "styled-components";

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

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
`;
