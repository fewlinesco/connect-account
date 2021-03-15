import React from "react";
import styled from "styled-components";

import { StyledButton, ButtonVariant } from "./buttons";

const FakeButton: React.FC<{ variant: ButtonVariant }> = ({
  variant,
  children,
}) => {
  return (
    <DivButton variant={variant} as="div">
      {children}
    </DivButton>
  );
};

const DivButton = styled(StyledButton)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { FakeButton };
