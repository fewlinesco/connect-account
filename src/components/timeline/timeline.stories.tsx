import React from "react";

import { StoriesContainer } from "../display/fewlines/StoriesContainer";
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
