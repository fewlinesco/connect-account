import { execute, makePromise, GraphQLRequest, FetchResult } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-fetch";

import config from "../config";

export function fetchManagement(
  operation: GraphQLRequest,
): Promise<FetchResult | Error> {
  const httpLink = new HttpLink({
    uri: config.connectManagement.graphqlEndpoint,
    fetch,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `API_KEY ${config.connectManagement.apiKey}`,
      },
    };
  });

  return makePromise(execute(authLink.concat(httpLink), operation));
}
