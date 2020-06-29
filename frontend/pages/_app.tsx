import { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "../src/design-system/globals/globalStyle";
import { lightTheme } from "../src/design-system/theme/lightTheme";
import Layout from "../src/components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
