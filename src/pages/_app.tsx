import { SSRProvider } from "@react-aria/ssr";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { ThemeProvider } from "styled-components";
import { SWRConfig } from "swr";

import * as locales from "@content/locales";
import { AlertMessages } from "@src/components/alert-message/alert-messages";
import { UserLocaleProvider } from "@src/context/locale-context";
import { GlobalStyle } from "@src/design-system/globals/global-style";
import { theme } from "@src/design-system/theme";
import { SWRError } from "@src/errors/errors";

import "@src/utils/sentry";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AccountApp>
      <Component {...pageProps} />
    </AccountApp>
  );
};

const AccountApp: React.FC = ({ children }) => {
  const { locale, defaultLocale, pathname } = useRouter();

  if (!locale) {
    return <>{children}</>;
  }

  const localeCopy = (locales as Record<string, unknown>)[locale];
  const messages = (localeCopy as Record<string, unknown>)[pathname] as
    | Record<string, string>
    | Record<string, MessageFormatElement[]>
    | undefined;

  return (
    <SSRProvider>
      <IntlProvider
        locale={locale}
        defaultLocale={defaultLocale}
        messages={messages}
        onError={() => null}
      >
        <ThemeProvider theme={theme}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <title>Connect Account</title>
          </Head>
          <GlobalStyle />
          <UserLocaleProvider>
            <AlertMessages />
            <SWRConfig
              value={{
                fetcher: async (url) =>
                  fetch(url).then(async (response) => {
                    if (!response.ok) {
                      const error = new SWRError(
                        "An error occurred while fetching the data.",
                      );

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
          </UserLocaleProvider>
        </ThemeProvider>
      </IntlProvider>
    </SSRProvider>
  );
};

export { AccountApp };
export default App;
