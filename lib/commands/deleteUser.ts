import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import { User, deleteUserStatus } from "../@types/ProviderUser";

const DELETE_USER_MUTATION = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(input: { userId: $userId }) {
      status
    }
  }
`;

export async function deleteUser(command: User): Promise<FetchResult> {
  const operation = {
    query: DELETE_USER_MUTATION,
    variables: command,
  };

  return fetchManagement(operation) as FetchResult<{
    deleteUser: deleteUserStatus;
  }>;
}
