import React from "react";

import { StoriesContainer } from "../display/fewlines/StoriesContainer";
import { Box } from "./box";

export default { title: "components/Box", component: Box };

export const StandardBox = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Box>Some text</Box>
    </StoriesContainer>
  );
};
