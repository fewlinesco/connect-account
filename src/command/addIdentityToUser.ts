import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { IdentityCommandProps } from "../@types/IdentityCommandProps";
import { fetchManagement } from "../utils/fetchManagement";

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
    }
  }
`;

export async function addIdentityToUser({
  userId,
  type,
  value,
}: IdentityCommandProps): Promise<FetchResult | Error> {
  const operation = {
    query: ADD_IDENTITY_TO_USER,
    variables: { userId, type, value },
  };

  return await fetchManagement(operation);
}
