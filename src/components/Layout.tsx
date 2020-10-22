import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { ClickAwayListener } from "./display/fewlines/ClickAwayListener";
import { DesktopNavigationBar } from "./display/fewlines/DesktopNavigationBar/DesktopNavigationBar";
import { Header } from "./display/fewlines/Header/Header";
import { MobileNavigationBar } from "./display/fewlines/MobileNavigationBar/MobileNavigationBar";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export const Layout: React.FC = ({ children }) => {
  const [isMobileNavBarOpen, setIsMobileNavbarOpen] = React.useState<boolean>(
    false,
  );
  const router = useRouter();

  return (
    <Main>
      {router && router.pathname !== "/" && (
        <MobileDisplayOnly>
          <Header />
        </MobileDisplayOnly>
      )}
      <Flex>
        {router && router.pathname !== "/" && (
          <DesktopNavigationBarWrapper>
            <DesktopNavigationBar />
          </DesktopNavigationBarWrapper>
        )}
        <ChildrenContainer>{children}</ChildrenContainer>
      </Flex>
      {router && router.pathname !== "/" && isMobileNavBarOpen && (
        <ClickAwayListener onClick={() => setIsMobileNavbarOpen(false)} />
      )}
      {router && router.pathname !== "/" && (
        <MobileNavigationBar
          isOpen={isMobileNavBarOpen}
          setIsOpen={setIsMobileNavbarOpen}
        />
      )}
    </Main>
  );
};

const Main = styled.main`
  width: 100%;
  height: 100vh;
  max-width: 88rem;
  margin: ${({ theme }) => theme.spaces.xxs} auto 0;
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
