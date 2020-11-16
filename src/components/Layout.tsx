import React from "react";
import styled from "styled-components";

import { DesktopNavigationBar } from "./display/fewlines/DesktopNavigationBar/DesktopNavigationBar";
import { Header } from "./display/fewlines/Header/Header";
import { MobileNavigationBar } from "./display/fewlines/MobileNavigationBar/MobileNavigationBar";
import { deviceBreakpoints } from "@src/design-system/theme";

export const Layout: React.FC = ({ children }) => {
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
    margin: 0 0 7.2rem 0;
  }
`;

const Flex = styled.div`
  display: flex;
`;

const DesktopNavigationBarWrapper = styled.div`
  min-width: 24rem;
  width: 30%;

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
