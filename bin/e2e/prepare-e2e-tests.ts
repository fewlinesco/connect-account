import { execute, makePromise, GraphQLRequest, FetchResult } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import gql from "graphql-tag";

function fetchManagement<T = unknown>(
  operation: GraphQLRequest,
): Promise<FetchResult<T>> {
  const httpLink = new HttpLink({
    uri: process.env.CONNECT_MANAGEMENT_URL,
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

  return makePromise(execute(authLink.concat(httpLink), operation)) as Promise<
    FetchResult<T>
  >;
}

const ADD_IDENTITY_TO_USER = gql`
  mutation addIdentityToUser(
    $userId: String!
    $type: IdentityTypes!
    $value: String!
  ) {
    addIdentityToUser(
      input: { userId: $userId, type: $type, value: $value, validated: true }
    ) {
      id
      primary
      status
      type
      value
    }
  }
`;

async function prepareE2ETests(): Promise<void> {
  const operation = {
    query: ADD_IDENTITY_TO_USER,
    variables: {
      userId: process.env.CONNECT_TEST_ACCOUNT_USER_ID,
      type: "EMAIL",
      value: "test_delete_this@taiko.test",
    },
  };

  await fetchManagement(operation);
}

prepareE2ETests();
