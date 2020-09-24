import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";

type ConfirmationBoxProps = {
  text: string;
  firstButton: {
    label: string;
    variant: ButtonVariant;
  };
  secondButton: {
    label: string;
    variant: ButtonVariant;
  };
};
export const ConfirmationBox: React.FC<ConfirmationBoxProps> = (structure) => {
  return (
    <Wrapper>
      <p>{structure.text}</p>
      <Button variant={structure.firstButton.variant}>
        {structure.firstButton.label}
      </Button>
      <Button variant={structure.secondButton.variant}>
        {structure.secondButton.label}
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    width: 100%;
    margin: ${({ theme }) => theme.spaces.component.xxs} 0 0 0;
  }
`;
