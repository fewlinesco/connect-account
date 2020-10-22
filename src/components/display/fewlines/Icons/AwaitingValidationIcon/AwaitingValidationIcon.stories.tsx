import React from "react";
import styled from "styled-components";

import { AwaitingValidationIcon } from "./AwaitingValidationIcon";

export default {
  title: "icons/Awaiting Validation Icon",
  component: AwaitingValidationIcon,
};

export const StandardAwaitingValidationIcon = (): JSX.Element => {
  return (
    <Container>
      <AwaitingValidationIcon />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;
