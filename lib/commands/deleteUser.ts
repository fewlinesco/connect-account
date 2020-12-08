import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import type { DeleteUserInput, DeleteUserStatus } from "../@types/ProviderUser";

const DELETE_USER_MUTATION = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(input: { userId: $userId }) {
      status
    }
  }
`;

export async function deleteUser(
  command: DeleteUserInput,
): Promise<FetchResult> {
  const operation = {
    query: DELETE_USER_MUTATION,
    variables: command,
  };

  return fetchManagement(operation) as FetchResult<{
    deleteUser: DeleteUserStatus;
  }>;
}
