import { ApolloProvider } from "@apollo/react-hooks";
import { AppProps } from "next/app";
import React from "react";

import withData from "../src/apolloClientConfig";

const MyApp: React.FC<AppProps & { apollo: any }> = ({
  Component,
  pageProps,
  apollo,
}) => {
  return (
    <ApolloProvider client={apollo}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default withData(MyApp);
