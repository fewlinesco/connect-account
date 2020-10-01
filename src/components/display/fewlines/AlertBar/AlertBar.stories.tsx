import React from "react";

import { AlertBar } from "./AlertBar";

export default {
  title: "components/AlertBar",
  component: AlertBar,
};

export const EmailValidationAlertBar = (): JSX.Element => {
  return <AlertBar text={"Confirmation email has been sent"} />;
};

export const PhoneValidationAlertBar = (): JSX.Element => {
  return <AlertBar text={"Confirmation SMS has been sent"} />;
};

export const EmailDeleteAlertBar = (): JSX.Element => {
  return <AlertBar text={"Email has been deleted"} />;
};

export const PhoneDeleteAlertBar = (): JSX.Element => {
  return <AlertBar text={"Phone number has been deleted"} />;
};
