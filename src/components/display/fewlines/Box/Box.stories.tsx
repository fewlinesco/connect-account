import React from "react";

import { Container } from "../Container";
import { Box } from "./Box";

export default { title: "components/Box", component: Box };

export const StandardBox = (): JSX.Element => {
  return (
    <Container>
      <Box>Some text</Box>
    </Container>
  );
};
