import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { Timeline } from "./timeline";

export default {
  title: "components/Timeline",
  component: Timeline,
};

export const StandardTimeLine = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Timeline />
    </StoriesContainer>
  );
};
