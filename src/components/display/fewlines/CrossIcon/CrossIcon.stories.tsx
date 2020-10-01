import React from "react";
import styled from "styled-components";

import { CrossIcon } from "./CrossIcon";

export default {
  title: "icons/CrossIcon",
  component: CrossIcon,
};

export const StandardCrossIcon = (): JSX.Element => {
  return (
    <Container>
      <CrossIcon />
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
`;
