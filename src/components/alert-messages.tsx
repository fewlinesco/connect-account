import { AlertMessage as AlertMessageDataStructure } from "@fwl/web";
import Cookies from "js-cookie";
import React from "react";
import styled from "styled-components";

import { CrossIcon } from "./icons/cross-icon";
import { deviceBreakpoints } from "@src/design-system/theme";

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
    <Wrapper>
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
    </Wrapper>
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
    <Alert>
      <p>{text}</p>
      <div
        className="cross"
        onClick={() => {
          setShowAlertMessage(false);
          setAlertMessages(
            alertMessages.filter((alertMessage) => alertMessage.id !== id),
          );
        }}
      >
        <CrossIcon />
      </div>
    </Alert>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 50%;
  transform: translate(50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  z-index: 1;
  width: 102.4rem;

  @media ${deviceBreakpoints.m} {
    width: 100%;
  }
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 4.4rem;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: 1.6rem 3rem;
  border-bottom: 0.1rem solid white;
  width: 60%;

  p {
    font-size: ${({ theme }) => theme.fontSizes.s};
    word-break: break-word;
    line-height: 1.6rem;
  }

  .cross {
    color: ${({ theme }) => theme.colors.background};
    margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
    cursor: pointer;
  }

  @media ${deviceBreakpoints.m} {
    width: 90%;
    margin: 0 auto;
  }
`;

export { AlertMessages, AlertMessage };
