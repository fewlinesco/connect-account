import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { Button, ButtonVariant } from "./buttons";

export default { title: "components/Buttons", component: Button };

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
