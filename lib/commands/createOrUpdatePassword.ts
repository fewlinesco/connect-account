import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import { CreateOrUpdatePasswordInput, User } from "@lib/@types/ProviderUser";

const CREATE_OR_UPDATE_PASSWORD_MUTATION = gql`
  mutation createOrUpdatePassword(
    $cleartextPassword: String!
    $userId: String!
  ) {
    createOrUpdatePassword(
      input: {
        input: { cleartextPassword: $cleartextPassword, userId: $userId }
      }
    ) {
      id
    }
  }
`;

export async function createOrUpdatePassword(
  command: CreateOrUpdatePasswordInput,
): Promise<
  FetchResult<{
    createOrUpdatePassword: User;
  }>
> {
  const operation = {
    query: CREATE_OR_UPDATE_PASSWORD_MUTATION,
    variables: command,
  };

  return fetchManagement(operation) as FetchResult<{
    createOrUpdatePassword: User;
  }>;
}
