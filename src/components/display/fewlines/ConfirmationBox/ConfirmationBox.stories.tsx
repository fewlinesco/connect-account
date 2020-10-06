import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { ClickAwayListener } from "./ClickAwayListener";
import { ConfirmationBox } from "./ConfirmationBox";

export default {
  title: "components/ConfirmationBox",
  component: ConfirmationBox,
};

export const PrimaryConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(true);
  return (
    <Container>
      <Button variant={ButtonVariant.PRIMARY} onClick={() => setOpen(!open)}>
        Show confirmation box
      </Button>
      {open && <ClickAwayListener onClick={() => setOpen(false)} />}
      <ConfirmationBox open={open}>
        <p>You are about to replace mail@mail.com as your main address</p>
        <Button variant={ButtonVariant.PRIMARY}>
          Set mail2@mail.com as my main
        </Button>
        <Button
          onClick={() => setOpen(false)}
          variant={ButtonVariant.SECONDARY}
        >
          Keep mail@mail.co as my primary email
        </Button>
      </ConfirmationBox>
    </Container>
  );
};

export const DangerConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(true);

  return (
    <Container>
      <div>
        <Button variant={ButtonVariant.PRIMARY} onClick={() => setOpen(!open)}>
          Show confirmation box
        </Button>
      </div>
      {open && <ClickAwayListener onClick={() => setOpen(false)} />}
      <ConfirmationBox open={open}>
        <p>You are about to delete mail@mail.co</p>
        <Button variant={ButtonVariant.DANGER}>
          Delete this email address
        </Button>
        <Button
          onClick={() => setOpen(false)}
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
