import React from "react";
import styled from "styled-components";

import AlertBar from "./alert-bar/alert-bar";
import { Header } from "./header/header";
import { DesktopNavigationBar } from "./navigation-bars/desktop-navigation-bar";
import { MobileNavigationBar } from "./navigation-bars/mobile-navigation-bar";
import { deviceBreakpoints } from "@src/design-system/theme";

export const Layout: React.FC<{ alertMessages?: string[] }> = ({
  children,
  alertMessages,
}) => {
  return (
    <Main>
      {alertMessages
        ? alertMessages.map((alertMessage) => {
            return (
              <AlertBar text={alertMessage} key={"alertBar" + Date.now()} />
            );
          })
        : null}
      <MobileDisplayOnly>
        <Header />
        <MobileNavigationBar />
      </MobileDisplayOnly>
      <Flex>
        <DesktopNavigationBarWrapper>
          <DesktopNavigationBar />
        </DesktopNavigationBarWrapper>
        <ChildrenContainer>{children}</ChildrenContainer>
      </Flex>
    </Main>
  );
};

export const Main = styled.main`
  width: 100%;
  height: 100vh;
  max-width: 88rem;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    height: auto;
  }
`;

const Flex = styled.div`
  display: flex;
`;

const DesktopNavigationBarWrapper = styled.div`
  min-width: 24rem;
  width: 30%;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

  @media ${deviceBreakpoints.m} {
    display: none;
  }
`;

const ChildrenContainer = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;

const MobileDisplayOnly = styled.div`
  display: none;

  @media ${deviceBreakpoints.m} {
    display: block;
  }
`;
