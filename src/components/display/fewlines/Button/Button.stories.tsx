import React from "react";

import { StoriesContainer } from "../StoriesContainer";
import { Button, ButtonVariant } from "./Button";

export default { title: "components/Button", component: Button };

export const PrimaryButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button variant={ButtonVariant.PRIMARY}>Primary</Button>
    </StoriesContainer>
  );
};

export const SecondaryButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button variant={ButtonVariant.SECONDARY}>Secondary</Button>
    </StoriesContainer>
  );
};

export const DangerButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button variant={ButtonVariant.DANGER}>Danger</Button>
    </StoriesContainer>
  );
};

export const GhostButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button variant={ButtonVariant.GHOST}>Ghost</Button>
    </StoriesContainer>
  );
};
