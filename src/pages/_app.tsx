import { AlertMessage } from "@fwl/web";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { ThemeProvider } from "styled-components";

import { AlertMessages } from "@src/components/alert-message/alert-messages";
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
  const [alertMessages, setAlertMessages] = React.useState<AlertMessage[]>([]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.cookie) {
        setAlertMessages([
          ...alertMessages,
          ...JSON.parse(decodeURIComponent(document.cookie).split("=")[1]),
        ]);

        document.cookie = "alert-messages=; max-age=0; path=/;";
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Connect Account</title>
      </Head>
      <GlobalStyle />
      <AlertMessages alertMessages={alertMessages} />
      {children}
    </ThemeProvider>
  );
};

export { AccountApp };
export default App;
