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
  const [hidden, setHidden] = React.useState<boolean>(false);
  return (
    <Wrapper>
      <div className={hidden ? "hidden" : "visible"}>
        <p>{structure.text}</p>
        <Button variant={structure.firstButton.variant}>
          {structure.firstButton.label}
        </Button>
        <Button
          onClick={() => setHidden(true)}
          variant={structure.secondButton.variant}
        >
          {structure.secondButton.label}
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .visible {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 2rem 3rem;
    position: absolute;
    width: 100%;
    left: 0;
    animation: appearFromBottom 0.1s;
    bottom: 0;
    visibility: visible;
  }

  .hidden {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 2rem 3rem;
    position: absolute;
    width: 100%;
    left: 0;
    animation: disappearFromBottom 0.1s;
    visibility: hidden;
  }

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
