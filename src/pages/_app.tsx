import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { ThemeProvider } from "styled-components";

import { AlertMessages } from "@src/components/alert-message/alert-messages";
import { AlertMessageProvider } from "@src/components/react-contexts/alert-messages-context";
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
      <AlertMessageProvider>
        <AlertMessages />
      </AlertMessageProvider>
      {children}
    </ThemeProvider>
  );
};

export { AccountApp };
export default App;
