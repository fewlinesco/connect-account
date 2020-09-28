import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "./Button";

export default { title: "Button", component: Button };

export const PrimaryButton = (): JSX.Element => {
  return (
    <Container>
      <Button variant={ButtonVariant.PRIMARY}>Primary</Button>
    </Container>
  );
};

export const SecondaryButton = (): JSX.Element => {
  return (
    <Container>
      <Button variant={ButtonVariant.SECONDARY}>Secondary</Button>
    </Container>
  );
};

export const DangerButton = (): JSX.Element => {
  return (
    <Container>
      <Button variant={ButtonVariant.DANGER}>Danger</Button>
    </Container>
  );
};

export const GhostButton = (): JSX.Element => {
  return (
    <Container>
      <Button variant={ButtonVariant.GHOST}>Ghost</Button>
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  margin: 0 auto;

  button {
    width: 100%;
  }
`;
