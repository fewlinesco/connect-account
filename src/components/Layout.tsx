import Head from "next/head";
import React from "react";
import styled from "styled-components";

import { Header } from "./Header";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Main>
        <Header />
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
