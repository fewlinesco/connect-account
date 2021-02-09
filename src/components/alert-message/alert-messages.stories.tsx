import React from "react";

import { AlertMessages } from "./alert-messages";

export default {
  title: "components/Alert Bar",
  component: AlertMessages,
};

export const EmailValidationAlertMessage = (): JSX.Element => {
  return <AlertMessages alertMessages={["Confirmation email has been sent"]} />;
};

export const PhoneValidationAlertMessage = (): JSX.Element => {
  return <AlertMessages alertMessages={["Confirmation SMS has been sent"]} />;
};

export const EmailDeleteAlertMessage = (): JSX.Element => {
  return <AlertMessages alertMessages={["Email has been deleted"]} />;
};

export const PhoneDeleteAlertMessage = (): JSX.Element => {
  return <AlertMessages alertMessages={["Phone number has been deleted"]} />;
};
