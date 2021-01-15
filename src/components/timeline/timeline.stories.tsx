import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { Timeline, TimelineEnd } from "./timeline";

export default {
  title: "components/Timelines",
  component: Timeline,
};

export const TimeLine = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Timeline />
    </StoriesContainer>
  );
};

export const TimeLineEnd = (): JSX.Element => {
  return (
    <StoriesContainer>
      <TimelineEnd />
    </StoriesContainer>
  );
};
