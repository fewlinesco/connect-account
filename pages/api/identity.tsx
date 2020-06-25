import gql from "graphql-tag";
import { NextApiRequest } from "next";

import { initializeApollo } from "../../src/graphql/apolloClientConfig";
// import addIdentityToUser from "../../src/graphql/mutation/addIdentityFromUser.graphql";
// import removeIdentityForUser from "../../src/graphql/mutation/removeIdentityFromUser.graphql";

// Declaring mutations here as "Schema type definitions not allowed in queries" and I need to type
// `type` as `IdentityTypes`
const ADD_IDENTITY_TO_USER = gql`
  mutation addIdentityToUser(
    $userId: String!
    $type: IdentityTypes!
    $value: String!
  ) {
    addIdentityToUser(input: { userId: $userId, type: $type, value: $value }) {
      id
      primary
      status
      type
      value
      __typename
    }
  }
`;

const REMOVE_IDENTITY_FROM_USER = gql`
  mutation removeIdentityFromUser(
    $userId: String!
    $type: IdentityTypes!
    $value: String!
  ) {
    removeIdentityFromUser(
      input: { userId: $userId, type: $type, value: $value }
    ) {
      id
      identities {
        id
        primary
        value
        type
        status
      }
    }
  }
`;

export default async (
  request: NextApiRequest,
  response: {
    statusCode: number;
    setHeader: (arg0: string, arg1: string) => void;
    end: (arg0: string) => JSON | PromiseLike<JSON>;
  },
): Promise<JSON> => {
  const apolloClient = initializeApollo();
  const { userId, type, value } = request.body;

  if (request.method === "POST") {
    await apolloClient.mutate({
      mutation: ADD_IDENTITY_TO_USER,
      variables: { userId, type, value },
    });

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");

    return response.end("GG");
  } else if (request.method === "DELETE") {
    await apolloClient.mutate({
      mutation: REMOVE_IDENTITY_FROM_USER,
      variables: { userId, type, value },
    });

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");

    return response.end("GG");
  }

  response.statusCode = 400;
  response.setHeader("Content-Type", "application/json");

  return response.end(":(");
};
