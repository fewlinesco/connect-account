import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { Timeline, TimelineEnd } from "./timelines";

const TimeLine = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Timeline />
    </StoriesContainer>
  );
};

const TimeLineEnd = (): JSX.Element => {
  return (
    <StoriesContainer>
      <TimelineEnd />
    </StoriesContainer>
  );
};

export { TimeLine, TimeLineEnd };
export default {
  title: "components/Timelines",
  component: Timeline,
};
