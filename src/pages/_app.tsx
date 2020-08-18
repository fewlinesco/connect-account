import { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";

import { Layout } from "../components/Layout";
import { GlobalStyle } from "../design-system/globals/globalStyle";
import { lightTheme } from "../design-system/theme/lightTheme";
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
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
};
