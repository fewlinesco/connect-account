import React from "react";
import styled from "styled-components";

import { CrossIcon } from "./edit-icon";

export default {
  title: "icons/Cross Icon",
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
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;
