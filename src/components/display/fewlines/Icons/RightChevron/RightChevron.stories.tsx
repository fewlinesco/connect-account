import React from "react";
import styled from "styled-components";

import { RightChevron } from "./RightChevron";

export default {
  title: "icons/RightChevron",
  component: RightChevron,
};

export const StandardRightChevron = (): JSX.Element => {
  return (
    <Container>
      <RightChevron />
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
`;
