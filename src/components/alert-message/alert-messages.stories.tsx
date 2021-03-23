import React from "react";
import { v4 as uuidv4 } from "uuid";

import { StoriesContainer } from "../containers/stories-container";
import { AlertMessage } from "./alert-messages";
import { generateAlertMessage } from "@src/utils/generateAlertMessage";

const EmailValidationAlertMessage = (): JSX.Element => {
  const generatedAlertMessage = generateAlertMessage(
    "Confirmation email has been sent",
  );
  const alertMessageID = uuidv4();

  return (
    <StoriesContainer>
      <AlertMessage
        key={alertMessageID}
        id={alertMessageID}
        text={generatedAlertMessage.text}
        alertMessages={[generatedAlertMessage]}
        setAlertMessages={() => {
          return;
        }}
      />
    </StoriesContainer>
  );
};

const PhoneValidationAlertMessage = (): JSX.Element => {
  const generatedAlertMessage = generateAlertMessage(
    "Confirmation SMS has been sent",
  );
  const alertMessageID = uuidv4();

  return (
    <StoriesContainer>
      <AlertMessage
        key={alertMessageID}
        id={alertMessageID}
        text={generatedAlertMessage.text}
        alertMessages={[generatedAlertMessage]}
        setAlertMessages={() => {
          return;
        }}
      />
    </StoriesContainer>
  );
};

const EmailDeleteAlertMessage = (): JSX.Element => {
  const generatedAlertMessage = generateAlertMessage("Email has been deleted");
  const alertMessageID = uuidv4();

  return (
    <StoriesContainer>
      <AlertMessage
        key={alertMessageID}
        id={alertMessageID}
        text={generatedAlertMessage.text}
        alertMessages={[generatedAlertMessage]}
        setAlertMessages={() => {
          return;
        }}
      />
    </StoriesContainer>
  );
};

const PhoneDeleteAlertMessage = (): JSX.Element => {
  const generatedAlertMessage = generateAlertMessage(
    "Phone number has been deleted",
  );
  const alertMessageID = uuidv4();

  return (
    <StoriesContainer>
      <AlertMessage
        key={alertMessageID}
        id={alertMessageID}
        text={generatedAlertMessage.text}
        alertMessages={[generatedAlertMessage]}
        setAlertMessages={() => {
          return;
        }}
      />
    </StoriesContainer>
  );
};

export {
  EmailValidationAlertMessage,
  PhoneValidationAlertMessage,
  EmailDeleteAlertMessage,
  PhoneDeleteAlertMessage,
};

export default {
  title: "components/Alert Messages",
  component: AlertMessage,
};
