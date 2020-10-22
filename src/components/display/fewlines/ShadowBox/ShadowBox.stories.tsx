import React from "react";

import { Container } from "../Container";
import { ShadowBox } from "./ShadowBox";

export default {
  title: "components/Shadow Box",
  component: ShadowBox,
};

export const StandardShadowBox = (): JSX.Element => {
  return (
    <Container>
      <ShadowBox>emailaddress@mail.test</ShadowBox>
    </Container>
  );
};
