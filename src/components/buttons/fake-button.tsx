import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "./buttons";

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

const DivButton = styled(Button)<{ variant?: ButtonVariant }>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.variant === ButtonVariant.PRIMARY &&
    `
      margin: 0;
    `};
`;

export { FakeButton };
