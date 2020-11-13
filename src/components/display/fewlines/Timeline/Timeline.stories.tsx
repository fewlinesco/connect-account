import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { Timeline } from "./Timeline";

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
