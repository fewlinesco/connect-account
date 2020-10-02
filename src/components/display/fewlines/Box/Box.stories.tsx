import React from "react";
import styled from "styled-components";

import { Box } from "./Box";

export default { title: "components/Box", component: Box };

export const StandardBox = (): JSX.Element => {
  return (
    <Container>
      <Box>Some text</Box>
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
`;
