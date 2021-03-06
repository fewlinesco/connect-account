import React from "react";
import styled from "styled-components";

import { Header } from "./header/header";
import { DesktopNavigationBar } from "./navigation-bars/desktop-navigation-bar";
import { MobileNavigationBar } from "./navigation-bars/mobile-navigation-bar";
import { NavigationBreadcrumbs } from "./navigation-breadcrumbs/navigation-breadcrumbs";
import { deviceBreakpoints } from "@src/design-system/theme";

const Layout: React.FC<{
  breadcrumbs: string | false;
  title?: string;
}> = ({ children, title, breadcrumbs }) => {
  return (
    <Main>
      <MobileDisplayOnly>
        <Header />
        <MobileNavigationBar />
      </MobileDisplayOnly>
      <Flex>
        <DesktopNavigationBarWrapper>
          <DesktopNavigationBar />
        </DesktopNavigationBarWrapper>
        <ChildrenContainer titleText={title} breadcrumbs={breadcrumbs}>
          {title ? (
            <MainTitle
              needSpacing={breadcrumbs || breadcrumbs === "" ? false : true}
            >
              {title}
            </MainTitle>
          ) : null}
          <NavigationBreadcrumbs breadcrumbs={breadcrumbs} />
          {children}
        </ChildrenContainer>
      </Flex>
    </Main>
  );
};

const Main = styled.main`
  width: 100%;
  height: 100vh;
  max-width: 102.4rem;
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

const ChildrenContainer = styled.div<{
  breadcrumbs: string | false;
  titleText?: string;
}>`
  width: 60%;
  margin: 0 auto;

  ${({ titleText, breadcrumbs }) =>
    !titleText &&
    !breadcrumbs &&
    `
      display: flex;
      align-items: center;
  `};

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
