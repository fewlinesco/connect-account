import { HttpStatus } from "@fwl/web";
import { SSRProvider } from "@react-aria/ssr";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { ThemeProvider } from "styled-components";
import { SWRConfig } from "swr";

import { AlertMessages } from "@src/components/alert-message/alert-messages";
import { GlobalStyle } from "@src/design-system/globals/global-style";
import { theme } from "@src/design-system/theme";
import { SWRError } from "@src/errors/errors";
import { ERRORS_DATA } from "@src/errors/web-errors";

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
    <SSRProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <title>Connect Account</title>
        </Head>
        <GlobalStyle />
        <AlertMessages />
        <SWRConfig
          value={{
            fetcher: async (url) =>
              fetch(url).then(async (response) => {
                if (!response.ok) {
                  const error = new SWRError(
                    "An error occurred while fetching the data.",
                  );

                  console.log("response:", response);

                  if (
                    response.status === HttpStatus.UNAUTHORIZED &&
                    response.statusText === ERRORS_DATA.UNAUTHORIZED.message
                  ) {
                    window.location.reload();
                    return;
                  }

                  error.info = await response.json();
                  error.statusCode = response.status;
                  throw error;
                }

                return response.json();
              }),
          }}
        >
          {children}
        </SWRConfig>
      </ThemeProvider>
    </SSRProvider>
  );
};

export { AccountApp };
export default App;
