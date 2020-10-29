import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { ThemeProvider } from "styled-components";

import { Layout } from "../components/Layout";
import { GlobalStyle } from "../design-system/globals/globalStyle";
import { theme } from "../design-system/theme";
import "../utils/sentry";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AccountApp>
      <Component {...pageProps} />
    </AccountApp>
  );
};

export default App;

export const AccountApp: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Connect Account</title>
      </Head>
      <GlobalStyle />
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
};
