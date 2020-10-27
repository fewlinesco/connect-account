import React from "react";
import styled from "styled-components";

import { CrossIcon } from "../Icons/CrossIcon/CrossIcon";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export const AlertBar: React.FC<{ text: string }> = ({ text }) => {
  const [showAlertBar, setShowAlertBar] = React.useState<boolean>(true);
  return (
    <Wrapper>
      {showAlertBar && (
        <>
          <DesktopNavigationBarSimulator />
          <ChildrenWrapperSimulator>
            <Alert>
              <p>{text}</p>
              <div className="cross" onClick={() => setShowAlertBar(false)}>
                <CrossIcon />
              </div>
            </Alert>
          </ChildrenWrapperSimulator>
        </>
      )}
    </Wrapper>
  );
};

export default AlertBar;

const Wrapper = styled.div`
  position: fixed;
  top: 2rem;
  left: 50%;
  margin-left: -44rem;
  width: 100%;
  max-width: 88rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${deviceBreakpoints.m} {
    max-width: 100%;
    left: 0;
    margin-left: 0;
  }
`;

const DesktopNavigationBarSimulator = styled.div`
  min-width: 24rem;
  width: 30%;
  height: 2rem;

  @media ${deviceBreakpoints.m} {
    display: none;
  }
`;

const ChildrenWrapperSimulator = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: 1.6rem;
  z-index: 1;
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
    margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
    cursor: pointer;
  }
`;
