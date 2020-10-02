import React from "react";

import { ButtonVariant } from "../Button/Button";
import { ConfirmationBox } from "./ConfirmationBox";

export default {
  title: "components/ConfirmationBox",
  component: ConfirmationBox,
};

export const PrimaryConfirmationBox = (): JSX.Element => {
  return (
    <ConfirmationBox
      text="You are about to replace mail@mail.com as your main address"
      firstButton={{
        label: "Set mail2@mail.com as my main",
        variant: ButtonVariant.PRIMARY,
      }}
      secondButton={{
        label: "Keep mail@mail.co as my primary email",
        variant: ButtonVariant.SECONDARY,
      }}
    />
  );
};

export const DangerConfirmationBox = (): JSX.Element => {
  return (
    <ConfirmationBox
      text="You are about to delete mail@mail.co"
      firstButton={{
        label: "Delete this email address",
        variant: ButtonVariant.DANGER,
      }}
      secondButton={{
        label: "Keep email address",
        variant: ButtonVariant.SECONDARY,
      }}
    />
  );
};
