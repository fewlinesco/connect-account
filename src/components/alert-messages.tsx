import { AlertMessage as AlertMessageDataStructure } from "@fwl/web";
import Cookies from "js-cookie";
import React from "react";

import { CrossIcon } from "./icons/cross-icon";

const AlertMessages: React.FC = () => {
  const [alertMessages, setAlertMessages] = React.useState<
    AlertMessageDataStructure[]
  >([]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const newAlertMessages = Cookies.get("alert-messages");

      if (newAlertMessages) {
        const parsedAlertMessages = JSON.parse(newAlertMessages);
        setAlertMessages([...alertMessages, ...parsedAlertMessages]);

        Cookies.remove("alert-messages");
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [alertMessages]);

  if (alertMessages.length === 0) {
    return null;
  }

  return (
    <div className="z-10 w-full lg:w-max flex flex-col items-end justify-center absolute top-4 right-2/4 transform translate-x-2/4">
      {alertMessages.map(({ id, text, expiresAt }) => {
        if (expiresAt < Date.now()) {
          return null;
        }

        return (
          <AlertMessage
            key={id}
            id={id}
            text={text}
            alertMessages={alertMessages}
            setAlertMessages={setAlertMessages}
          />
        );
      })}
    </div>
  );
};

const AlertMessage: React.FC<
  Omit<AlertMessageDataStructure, "expiresAt"> & {
    alertMessages: AlertMessageDataStructure[];
    setAlertMessages: React.Dispatch<
      React.SetStateAction<AlertMessageDataStructure[]>
    >;
  }
> = ({ id, text, alertMessages, setAlertMessages }) => {
  const [showAlertMessage, setShowAlertMessage] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowAlertMessage(false);

      setAlertMessages(
        alertMessages.filter((alertMessage) => alertMessage.id !== id),
      );
    }, 3000);

    return () => {
      setAlertMessages(
        alertMessages.filter((alertMessage) => alertMessage.id !== id),
      );

      clearTimeout(timeoutId);
    };
  }, [alertMessages, id, setAlertMessages]);

  if (!showAlertMessage) {
    return null;
  }

  return (
    <div className="flex items-center justify-between w-11/12 m-auto lg:mr-16 bg-black text-background rounded py-6 px-12">
      <p className="break-words leading-relaxed">{text}</p>
      <div
        className="text-background ml-4 cursor-pointer"
        onClick={() => {
          setShowAlertMessage(false);
          setAlertMessages(
            alertMessages.filter((alertMessage) => alertMessage.id !== id),
          );
        }}
      >
        <CrossIcon />
      </div>
    </div>
  );
};

export { AlertMessages, AlertMessage };
