import { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";

import { Layout } from "../components/Layout";
import { GlobalStyle } from "../design-system/globals/globalStyle";
import { lightTheme } from "../design-system/theme/lightTheme";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
