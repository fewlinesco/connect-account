import { execute, makePromise, GraphQLRequest, FetchResult } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";

import { config } from "../config";

export function fetchManagement(
  operation: GraphQLRequest,
): Promise<FetchResult> {
  const httpLink = new HttpLink({
    uri: config.connectManagementUrl,
    fetch,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `API_KEY ${config.connectManagementApiKey}`,
      },
    };
  });

  return makePromise(execute(authLink.concat(httpLink), operation));
}
