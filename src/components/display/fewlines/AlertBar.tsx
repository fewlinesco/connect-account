import React from "react";
import styled from "styled-components";

import { CrossIcon } from "./CrossIcon";

export const AlertBar: React.FC<{ text: string }> = ({ text }) => {
  const [showAlertBar, setShowAlertBar] = React.useState<boolean>(true);
  return (
    <Wrapper>
      {showAlertBar && (
        <Alert>
          <p>{text}</p>
          <div className="cross" onClick={() => setShowAlertBar(false)}>
            <CrossIcon />
          </div>
        </Alert>
      )}
    </Wrapper>
  );
};

export default AlertBar;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 90%;
  max-width: 34rem;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: 1.6rem;
  z-index: 1;
  top: 2rem;
  visibility: hidden;
  opacity: 0;
  animation: fadeinout 3s;

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
    margin: 0 0 0 ${({ theme }) => theme.spaces.component.xxs};
  }
`;
