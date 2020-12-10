import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "@src/design-system/globals/globalStyle";
import { theme } from "@src/design-system/theme";
import "@src/utils/sentry";

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
      {children}
    </ThemeProvider>
  );
};
