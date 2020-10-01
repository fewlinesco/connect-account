import React from "react";
import styled from "styled-components";

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

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
`;
