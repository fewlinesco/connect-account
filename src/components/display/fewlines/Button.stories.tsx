import React from "react";

import { ButtonVariant } from "../../../@types/ButtonVariant";
import { Button } from "./Button";

export default { title: "Button", component: Button };

export const PrimaryButton = (): JSX.Element => {
  return <Button variant={ButtonVariant.PRIMARY}>Primary</Button>;
};

export const SecondaryButton = (): JSX.Element => {
  return <Button variant={ButtonVariant.SECONDARY}>Secondary</Button>;
};

export const DangerButton = (): JSX.Element => {
  return <Button variant={ButtonVariant.DANGER}>Danger</Button>;
};

export const GhostButton = (): JSX.Element => {
  return <Button variant={ButtonVariant.GHOST}>Ghost</Button>;
};
