import { execute, makePromise, GraphQLRequest, FetchResult } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";

export function fetchManagement(
  operation: GraphQLRequest,
): Promise<FetchResult | Error> {
  const httpLink = new HttpLink({
    uri: "",
    fetch,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `API_KEY ${process.env.CONNECT_MANAGEMENT_API_KEY}`,
      },
    };
  });

  return makePromise(execute(authLink.concat(httpLink), operation));
}
