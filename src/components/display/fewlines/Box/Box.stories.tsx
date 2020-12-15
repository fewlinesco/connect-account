import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { Box } from "./Box";

export default { title: "components/Box", component: Box };

export const StandardBox = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Box>Some text</Box>
    </StoriesContainer>
  );
};
