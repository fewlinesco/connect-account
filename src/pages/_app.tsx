import { HttpStatus } from "@fwl/web";
import { SSRProvider } from "@react-aria/ssr";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { SWRConfig } from "swr";

import * as locales from "@content/locales";
import { AlertMessages } from "@src/components/alert-messages";
import { CookieBanner } from "@src/components/cookie-banner";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { SWRError } from "@src/errors/errors";

import "tailwindcss/tailwind.css";
import "@src/design-system/global-style.css";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AccountApp>
      <Component {...pageProps} />
    </AccountApp>
  );
};

const AccountApp: React.FC = ({ children }) => {
  const router = useRouter();

  if (!router.locale) {
    return <>{children}</>;
  }

  const localeCopy = (locales as Record<string, unknown>)[router.locale];
  const messages = (localeCopy as Record<string, unknown>)[router.pathname] as
    | Record<string, string>
    | Record<string, MessageFormatElement[]>
    | undefined;

  return (
    <SSRProvider>
      <IntlProvider
        locale={router.locale}
        defaultLocale={router.defaultLocale}
        messages={messages}
        onError={() => null}
      >
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <title>Connect Account</title>
        </Head>
        <AlertMessages />
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            fetcher: async (url) =>
              fetch(url).then(async (response) => {
                if (!response.ok) {
                  const error = new SWRError(
                    "An error occurred while fetching the data.",
                  );

                  if (
                    response.status === HttpStatus.UNAUTHORIZED &&
                    response.statusText === "Unauthorized"
                  ) {
                    router && router.replace(router.pathname);
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
          {CONFIG_VARIABLES.featureFlag ? <CookieBanner /> : null}
        </SWRConfig>
      </IntlProvider>
    </SSRProvider>
  );
};

export { AccountApp };
export default App;
