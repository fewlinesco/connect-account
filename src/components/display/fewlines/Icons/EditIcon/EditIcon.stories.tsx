import React from "react";
import styled from "styled-components";

import { EditIcon } from "./EditIcon";

export default {
  title: "icons/Edit Icon",
  component: EditIcon,
};

export const StandardEditIcon = (): JSX.Element => {
  return (
    <Container>
      <EditIcon />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;
