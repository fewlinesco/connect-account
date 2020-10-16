import Head from "next/head";
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
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Connect Account</title>
      </Head>
      <Main>
        {router && router.pathname !== "/" && (
          <MobileDisplayOnly>
            <Header />
          </MobileDisplayOnly>
        )}
        <DesktopView>
          <DesktopNavigationBar />
          {children}
        </DesktopView>
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
    </>
  );
};

const Main = styled.main`
  width: 100%;
  height: 100vh;
  max-width: 88rem;
  margin: ${({ theme }) => theme.spaces.xxs} auto 0;
`;

const DesktopView = styled.div`
  display: flex;
`;

const MobileDisplayOnly = styled.div`
  display: none;
  @media ${deviceBreakpoints.m} {
    display: block;
  }
`;
