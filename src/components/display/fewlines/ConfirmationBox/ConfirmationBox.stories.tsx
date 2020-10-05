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
      <ConfirmationBox hidden={hidden}>
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
      </ConfirmationBox>
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
      <ConfirmationBox hidden={hidden}>
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
      </ConfirmationBox>
    </Container>
  );
};

const Container = styled.div`
  p {
    margin: 0 0 ${({ theme }) => theme.spaces.component.xs};
  }

  button {
    width: 100%;
    margin: 0 0 ${({ theme }) => theme.spaces.component.xxs};
  }
`;
