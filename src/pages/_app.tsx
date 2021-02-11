import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "@src/design-system/globals/global-style";
import { theme } from "@src/design-system/theme";
import "@src/utils/sentry";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AccountApp>
      <Component {...pageProps} />
    </AccountApp>
  );
};

const AccountApp: React.FC = ({ children }) => {
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

export { AccountApp };
export default App;
