import React from "react";
import styled from "styled-components";

import { CrossIcon } from "./cross-icon";

const StandardCrossIcon = (): JSX.Element => {
  return (
    <Container>
      <CrossIcon />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;

export { StandardCrossIcon };
export default {
  title: "icons/Cross Icon",
  component: CrossIcon,
};
