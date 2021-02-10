import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "./buttons";

export const FakeButton: React.FC<{ variant: ButtonVariant }> = ({
  variant,
  children,
}) => {
  return (
    <DivButton variant={variant} as="div">
      {children}
    </DivButton>
  );
};

interface ButtonProps {
  variant?: ButtonVariant;
}

const DivButton = styled(Button)<ButtonProps>`
  /* ${(props) =>
    props.variant === ButtonVariant.PRIMARY &&
    `
      margin: 0;
    `}; */

  display: flex;
  justify-content: center;
  align-items: center;
`;
