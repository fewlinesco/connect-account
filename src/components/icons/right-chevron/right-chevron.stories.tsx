import React from "react";
import styled from "styled-components";

import { RightChevron } from "./right-chevron";

const StandardRightChevron = (): JSX.Element => {
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

export { StandardRightChevron };
export default {
  title: "icons/Right Chevron",
  component: RightChevron,
};
