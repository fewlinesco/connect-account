import React from "react";

import { StoriesContainer } from "../../../containers/stories-container";
import { TimelineEnd } from "./TimelineEnd";

export default {
  title: "components/TimelineEnd",
  component: TimelineEnd,
};

export const StandardTimeLineEnd = (): JSX.Element => {
  return (
    <StoriesContainer>
      <TimelineEnd />
    </StoriesContainer>
  );
};
