import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Header } from "./display/fewlines/Header/Header";

export const Layout: React.FC = ({ children }) => {
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
