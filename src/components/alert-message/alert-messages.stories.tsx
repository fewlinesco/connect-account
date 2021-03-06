import React from "react";

import { AlertMessages } from "./alert-messages";

const EmailValidationAlertMessage = (): JSX.Element => {
  return (
    <AlertMessages
      alertMessages={[
        {
          text: "Confirmation email has been sent",
          expiresAt: Date.now() + 300000,
        },
      ]}
    />
  );
};

const PhoneValidationAlertMessage = (): JSX.Element => {
  return (
    <AlertMessages
      alertMessages={[
        {
          text: "Confirmation SMS has been sent",
          expiresAt: Date.now() + 300000,
        },
      ]}
    />
  );
};

const EmailDeleteAlertMessage = (): JSX.Element => {
  return (
    <AlertMessages
      alertMessages={[
        {
          text: "Email has been deleted",
          expiresAt: Date.now() + 300000,
        },
      ]}
    />
  );
};

const PhoneDeleteAlertMessage = (): JSX.Element => {
  return (
    <AlertMessages
      alertMessages={[
        {
          text: "Phone number has been deleted",
          expiresAt: Date.now() + 300000,
        },
      ]}
    />
  );
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
