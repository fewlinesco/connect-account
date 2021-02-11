import React from "react";
import styled from "styled-components";

import { AwaitingValidationIcon } from "./awaiting-validation-icon";

const StandardAwaitingValidationIcon = (): JSX.Element => {
  return (
    <Container>
      <AwaitingValidationIcon />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;

export { StandardAwaitingValidationIcon };
export default {
  title: "icons/Awaiting Validation Icon",
  component: AwaitingValidationIcon,
};
