import React from "react";

import { StoriesContainer } from "../../../containers/stories-container";
import { ShadowBox } from "./ShadowBox";

export default {
  title: "components/Shadow Box",
  component: ShadowBox,
};

export const StandardShadowBox = (): JSX.Element => {
  return (
    <StoriesContainer>
      <ShadowBox>emailaddress@mail.test</ShadowBox>
    </StoriesContainer>
  );
};
