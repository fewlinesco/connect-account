import React from "react";
import Anime, { anime } from "react-anime";
import styled from "styled-components";

import { AlertMessages } from "./alert-message/alert-messages";
import { Header } from "./header/header";
import { DesktopNavigationBar } from "./navigation-bars/desktop-navigation-bar";
import { MobileNavigationBar } from "./navigation-bars/mobile-navigation-bar";
import { NavigationBreadcrumbs } from "./navigation-breadcrumbs/navigation-breadcrumbs";
import { deviceBreakpoints } from "@src/design-system/theme";

const Layout: React.FC<{
  alertMessages?: string[];
  title?: string;
  breadcrumbs?: string[];
}> = ({ children, alertMessages, title, breadcrumbs }) => {
  React.useEffect(() => {
    if (alertMessages) {
      document.cookie = "alert-messages=; max-age=0; path=/;";
    }
  }, []);

  return (
    <Main>
      <AlertMessages alertMessages={alertMessages} />
      <MobileDisplayOnly>
        <Header />
        <MobileNavigationBar />
      </MobileDisplayOnly>
      <Flex>
        <DesktopNavigationBarWrapper>
          <DesktopNavigationBar />
        </DesktopNavigationBarWrapper>
        <ChildrenContainer>
          {title ? (
            <MainTitle needSpacing={breadcrumbs ? false : true}>
              {title}
            </MainTitle>
          ) : null}
          {breadcrumbs ? (
            <NavigationBreadcrumbs breadcrumbs={breadcrumbs} />
          ) : null}
          <Anime
            opacity={[0, 1]}
            translateY={"1em"}
            delay={(_e, i) => (i ? i * 1000 : 0)}
          >
            {children}
          </Anime>
        </ChildrenContainer>
      </Flex>
    </Main>
  );
};

const Main = styled.main`
  width: 100%;
  height: 100vh;
  max-width: 88rem;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    height: auto;
  }

  h2 {
    margin: 0 0 ${({ theme }) => theme.spaces.xxs} 0;
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spaces.s} 0;
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
  height: 100vh;
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

const MainTitle = styled.h1<{ needSpacing?: boolean }>`
  padding: 2.4rem 0 ${({ theme }) => theme.spaces.xxs};
  margin-top: 0.5rem;
  ${({ theme, needSpacing }) =>
    needSpacing && `margin-bottom: ${theme.spaces.s}`}
`;

export { Layout, Main };
