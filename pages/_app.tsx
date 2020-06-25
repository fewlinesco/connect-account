import { ApolloProvider } from "@apollo/react-hooks";
import { AppProps } from "next/app";
import React from "react";

import { useApollo } from "../src/graphql/apolloClientConfig";

const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
