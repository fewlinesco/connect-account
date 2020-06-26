import {
  InMemoryCache,
  NormalizedCacheObject,
  defaultDataIdFromObject,
  IdGetterObj,
} from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { useMemo } from "react";

const httpLink = new HttpLink({
  fetch,
  uri: process.env.CONNECT_MANAGEMENT_URL,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `API_KEY ${process.env.CONNECT_MANAGEMENT_API_KEY}`,
    },
  };
});

let apolloClient: ApolloClient<NormalizedCacheObject>;

type IdentitiesType = "email" | "phone";

function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      dataIdFromObject: (object) => {
        switch (object.__typename) {
          case "User":
            return "currentUser";
          case "Identity":
            if (
              (object as IdGetterObj & { type: IdentitiesType }).type ===
              "email"
            ) {
              return "userEmail";
            } else if (
              (object as IdGetterObj & { type: IdentitiesType }).type ===
              "phone"
            ) {
              return "userPhone";
            }

            return defaultDataIdFromObject(object);
          default:
            return defaultDataIdFromObject(object);
        }
      },
    }),
  });
}

export function initializeApollo(
  initialState = {},
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState !== {}) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(
  initialState: ApolloClient<NormalizedCacheObject>,
): ApolloClient<NormalizedCacheObject> {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);

  return store;
}
