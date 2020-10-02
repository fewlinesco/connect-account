import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { ConfirmationBox } from "./ConfirmationBox";

export default {
  title: "components/ConfirmationBox",
  component: ConfirmationBox,
};

export const PrimaryConfirmationBox = (): JSX.Element => {
  const [hidden, setHidden] = React.useState<boolean>(false);
  return (
    <Container>
      <Button
        variant={ButtonVariant.PRIMARY}
        onClick={() => setHidden(!hidden)}
      >
        Click me
      </Button>
      <div className={hidden ? "hidden" : "visible"}>
        <p>You are about to replace mail@mail.com as your main address</p>
        <Button variant={ButtonVariant.PRIMARY}>
          Set mail2@mail.com as my main
        </Button>
        <Button
          onClick={() => setHidden(true)}
          variant={ButtonVariant.SECONDARY}
        >
          Keep mail@mail.co as my primary email
        </Button>
      </div>
    </Container>
  );
};

export const DangerConfirmationBox = (): JSX.Element => {
  const [hidden, setHidden] = React.useState<boolean>(false);
  return (
    <Container>
      <Button
        variant={ButtonVariant.PRIMARY}
        onClick={() => setHidden(!hidden)}
      >
        Click me
      </Button>
      <div className={hidden ? "hidden" : "visible"}>
        <p>You are about to delete mail@mail.co</p>
        <Button variant={ButtonVariant.DANGER}>
          Delete this email address
        </Button>
        <Button
          onClick={() => setHidden(true)}
          variant={ButtonVariant.SECONDARY}
        >
          Keep email address
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
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
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
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
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0);
    }
    to {
      bottom: 0;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
    }
  }

  @keyframes disappearFromBottom {
    from {
      bottom: 0;
      visibility: visible;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
    }
    to {
      bottom: -200px;
      visibility: hidden;
    }
  }
`;
