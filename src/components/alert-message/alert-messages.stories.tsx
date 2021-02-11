import React from "react";

import { AlertMessages } from "./alert-messages";

const EmailValidationAlertMessage = (): JSX.Element => {
  return <AlertMessages alertMessages={["Confirmation email has been sent"]} />;
};

const PhoneValidationAlertMessage = (): JSX.Element => {
  return <AlertMessages alertMessages={["Confirmation SMS has been sent"]} />;
};

const EmailDeleteAlertMessage = (): JSX.Element => {
  return <AlertMessages alertMessages={["Email has been deleted"]} />;
};

const PhoneDeleteAlertMessage = (): JSX.Element => {
  return <AlertMessages alertMessages={["Phone number has been deleted"]} />;
};

export {
  EmailValidationAlertMessage,
  PhoneValidationAlertMessage,
  EmailDeleteAlertMessage,
  PhoneDeleteAlertMessage,
};

export default {
  title: "components/Alert Bar",
  component: AlertMessages,
};
