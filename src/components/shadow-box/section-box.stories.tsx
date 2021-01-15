import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { SectionBox } from "./section-box";

export default {
  title: "components/Section Box",
  component: SectionBox,
};

export const StandardShadowBox = (): JSX.Element => {
  return (
    <StoriesContainer>
      <SectionBox>emailaddress@mail.test</SectionBox>
    </StoriesContainer>
  );
};
