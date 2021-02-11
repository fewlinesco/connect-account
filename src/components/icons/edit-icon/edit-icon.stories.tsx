import React from "react";
import styled from "styled-components";

import { EditIcon } from "./edit-icon";

const StandardEditIcon = (): JSX.Element => {
  return (
    <Container>
      <EditIcon />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;

export { StandardEditIcon };
export default {
  title: "icons/Edit Icon",
  component: EditIcon,
};
