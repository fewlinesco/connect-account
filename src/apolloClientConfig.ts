import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import withApollo from "next-with-apollo";

const dev = process.env.NODE_ENV !== "production";

const managementEndpoint = dev
  ? process.env.CONNECT_MANAGEMENT_URL
  : process.env.CONNECT_MANAGEMENT_URL;

const httpLink = new HttpLink({
  fetch,
  uri: managementEndpoint,
});

export default withApollo(
  ({ initialState }) =>
    new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache().restore(initialState || {}),
    }),
);
