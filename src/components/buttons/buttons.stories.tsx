import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { Button, ButtonVariant } from "./buttons";

const PrimaryButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button type="button" variant={ButtonVariant.PRIMARY}>
        Primary
      </Button>
    </StoriesContainer>
  );
};

const SecondaryButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button type="button" variant={ButtonVariant.SECONDARY}>
        Secondary
      </Button>
    </StoriesContainer>
  );
};

const LightGreyButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button type="button" variant={ButtonVariant.LIGHT_GREY}>
        Secondary
      </Button>
    </StoriesContainer>
  );
};

const DangerButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button type="button" variant={ButtonVariant.DANGER}>
        Danger
      </Button>
    </StoriesContainer>
  );
};

const GhostButton = (): JSX.Element => {
  return (
    <StoriesContainer>
      <Button type="button" variant={ButtonVariant.GHOST}>
        Ghost
      </Button>
    </StoriesContainer>
  );
};

export {
  PrimaryButton,
  SecondaryButton,
  LightGreyButton,
  DangerButton,
  GhostButton,
};
export default { title: "components/Buttons", component: Button };
