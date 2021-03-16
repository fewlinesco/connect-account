import { AlertMessage as AlertMessageDataStructure } from "@fwl/web";
import React from "react";
import styled from "styled-components";

import { CrossIcon } from "../icons/cross-icon/cross-icon";
import { deviceBreakpoints } from "@src/design-system/theme";

const AlertMessages: React.FC<{
  alertMessages?: AlertMessageDataStructure[];
}> = ({ alertMessages }) => {
  if (!alertMessages) {
    return null;
  }
  if (alertMessages.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      {alertMessages.map(({ text, expiresAt }) => {
        if (expiresAt < Date.now()) {
          return null;
        }

        return <AlertMessage key={"alertMessage" + Date.now()} text={text} />;
      })}
    </Wrapper>
  );
};

const AlertMessage: React.FC<{ text: string }> = ({ text }) => {
  const [showAlertMessage, setShowAlertMessage] = React.useState<boolean>(true);

  if (!showAlertMessage) {
    return null;
  }

  return (
    <Alert>
      <p>{text}</p>
      <div className="cross" onClick={() => setShowAlertMessage(false)}>
        <CrossIcon />
      </div>
    </Alert>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 2rem;
  width: 100%;
  max-width: 88rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 1;

  @media ${deviceBreakpoints.m} {
    max-width: 100%;
    left: 0;
    margin-left: 0;
  }
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60%;
  margin-right: 4.4rem;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: 1.6rem;
  visibility: hidden;
  opacity: 0;
  animation: fadeinout 3s;
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
