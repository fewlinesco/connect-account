import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { ClickAwayListener } from "./display/fewlines/ClickAwayListener";
import { Header } from "./display/fewlines/Header/Header";
import { MobileNavigationBar } from "./display/fewlines/MobileNavigationBar/MobileNavigationBar";

export const Layout: React.FC = ({ children }) => {
  const [mobileNavBarOpen, setMobileNavbarOpen] = React.useState<boolean>(
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
        {router && router.pathname !== "/" && <Header />}
        {children}
        {router && router.pathname !== "/" && mobileNavBarOpen && (
          <ClickAwayListener onClick={() => setMobileNavbarOpen(false)} />
        )}
        {router && router.pathname !== "/" && (
          <MobileNavigationBar
            open={mobileNavBarOpen}
            setOpen={setMobileNavbarOpen}
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
  margin: 0 auto;
`;
