import React from "react";
import styled from "styled-components";

import { PrimaryIcon } from "./PrimaryIcon";

export default { title: "icons/PrimaryIcon", component: PrimaryIcon };

export const StandardPrimaryIcon = (): JSX.Element => {
  return (
    <Container>
      <PrimaryIcon />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;
