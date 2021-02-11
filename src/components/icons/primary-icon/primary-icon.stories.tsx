import React from "react";
import styled from "styled-components";

import { PrimaryIcon } from "./primary-icon";

const StandardPrimaryIcon = (): JSX.Element => {
  return (
    <Container>
      <PrimaryIcon />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;

export { StandardPrimaryIcon };
export default { title: "icons/Primary Icon", component: PrimaryIcon };
