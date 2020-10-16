import React from "react";

import { Button, ButtonVariant } from "../Button/Button";
import { ClickAwayListener } from "../ClickAwayListener";
import { Container } from "../Container";
import { ConfirmationText } from "../ShowIdentity/ShowIdentity";
import { ConfirmationBox } from "./ConfirmationBox";

export default {
  title: "components/ConfirmationBox",
  component: ConfirmationBox,
};

export const PrimaryConfirmationBox = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);

  return (
    <Container>
      <Button
        variant={ButtonVariant.PRIMARY}
        onClick={() => {
          setPreventAnimation(false);
          setOpen(!open);
        }}
      >
        Show confirmation box
      </Button>
      {open && <ClickAwayListener onClick={() => setOpen(false)} />}
      <ConfirmationBox open={open} preventAnimation={preventAnimation}>
        <ConfirmationText>
          You are about to replace mail@mail.com as your main address
        </ConfirmationText>
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
  const [open, setOpen] = React.useState<boolean>(false);
  const [preventAnimation, setPreventAnimation] = React.useState<boolean>(true);

  return (
    <Container>
      <div>
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={() => {
            setPreventAnimation(false);
            setOpen(!open);
          }}
        >
          Show confirmation box
        </Button>
      </div>
      {open && <ClickAwayListener onClick={() => setOpen(false)} />}
      <ConfirmationBox open={open} preventAnimation={preventAnimation}>
        <ConfirmationText>
          You are about to delete mail@mail.co
        </ConfirmationText>
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
