import gql from "graphql-tag";
import { NextApiRequest, NextApiResponse } from "next";

import { fetchManagement } from "../../utils/fetchManagement";

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
  response: NextApiResponse,
): Promise<void> => {
  const { userId, type, value } = request.body;

  if (request.method === "POST") {
    const operation = {
      query: ADD_IDENTITY_TO_USER,
      variables: { userId, type, value },
    };

    fetchManagement(operation)
      .then(() => {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        return response.end("GG");
      })
      .catch((error) => {
        console.log(error);

        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");

        return response.end(":(");
      });
  } else if (request.method === "DELETE") {
    const operation = {
      query: REMOVE_IDENTITY_FROM_USER,
      variables: { userId, type, value },
    };

    fetchManagement(operation)
      .then(() => {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");

        return response.end("GG");
      })
      .catch((error) => {
        console.log(error);

        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");

        return response.end(":(");
      });
  }

  response.statusCode = 400;
  response.setHeader("Content-Type", "application/json");

  return response.end(":(");
};
