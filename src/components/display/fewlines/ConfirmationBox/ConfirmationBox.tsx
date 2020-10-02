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
    onClick: void;
  };
};
export const ConfirmationBox: React.FC<ConfirmationBoxProps> = (structure) => {
  return (
    <Wrapper>
      <p>{structure.text}</p>
      <Button variant={structure.firstButton.variant}>
        {structure.firstButton.label}
      </Button>
      <Button
        onClick={() => structure.secondButton.onClick}
        variant={structure.secondButton.variant}
      >
        {structure.secondButton.label}
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  p {
    margin: 0 0 ${({ theme }) => theme.spaces.component.xs};
  }

  button {
    width: 100%;
    margin: 0 0 ${({ theme }) => theme.spaces.component.xxs};
  }

  @keyframes appearFromBottom {
    from {
      bottom: -200px;
    }
    to {
      bottom: 0;
    }
  }

  @keyframes disappearFromBottom {
    from {
      bottom: 0;
      visibility: visible;
    }
    to {
      bottom: -200px;
      visibility: hidden;
    }
  }
`;
