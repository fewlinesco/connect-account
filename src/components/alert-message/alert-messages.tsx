// import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { CrossIcon } from "../icons/cross-icon/cross-icon";
import { useAlertMessages } from "../react-contexts/alert-messages-context";
import { deviceBreakpoints } from "@src/design-system/theme";

const AlertMessages: React.FC = () => {
  const { alertMessages, setAlertMessages } = useAlertMessages();
  // const router = useRouter();
  console.log(alertMessages);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.cookie) {
        setAlertMessages([
          ...alertMessages,
          ...JSON.parse(decodeURIComponent(document.cookie).split("=")[1]),
        ]);

        document.cookie = "alert-messages=; max-age=0; path=/;";
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (alertMessages.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      {alertMessages.map(({ text, expiresAt }, index) => {
        if (expiresAt < Date.now()) {
          return null;
        }

        return (
          <AlertMessage key={"alertMessage" + Date.now() + index} text={text} />
        );
      })}
    </Wrapper>
  );
};

const AlertMessage: React.FC<{
  text: string;
}> = ({ text }) => {
  const { setAlertMessages } = useAlertMessages();
  const [showAlertMessage, setShowAlertMessage] = React.useState<boolean>(true);
  const animationDuration = 3;

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowAlertMessage(false);
    }, animationDuration * 1000);

    return () => {
      setAlertMessages([]);

      clearTimeout(timeoutId);
    };
  }, []);

  if (!showAlertMessage) {
    return null;
  }

  return (
    <Alert animationDuration={animationDuration}>
      <p>{text}</p>
      <div className="cross" onClick={() => setShowAlertMessage(false)}>
        <CrossIcon />
      </div>
    </Alert>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 1rem;
  right: 50%;
  transform: translate(50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;

  @media ${deviceBreakpoints.m} {
    max-width: 100%;
    left: 0;
    margin-left: 0;
  }
`;

const Alert = styled.div<{ animationDuration: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 4.4rem;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: 1.6rem 3rem;
  visibility: hidden;
  opacity: 0;
  animation: fadeinout ${({ animationDuration }) => animationDuration}s;
  border-bottom: 0.1rem solid white;

  @keyframes fadeinout {
    0%,
    100% {
      opacity: 0;
      visibility: hidden;
    }

    10%,
    90% {
      opacity: 1;
      visibility: visible;
    }
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.s};
  }

  .cross {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
    cursor: pointer;
  }

  @media ${deviceBreakpoints.m} {
    width: 90%;
    margin: 0 auto;
  }
`;

export { AlertMessages };
