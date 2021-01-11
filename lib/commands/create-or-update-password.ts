import type { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetch-management";
import { CreateOrUpdatePasswordInput, User } from "../@types/provider-user";

export type CreateOrUpdatePassword = Promise<
  FetchResult<{
    createOrUpdatePassword: User;
  }>
>;

const CREATE_OR_UPDATE_PASSWORD_MUTATION = gql`
  mutation createOrUpdatePassword($cleartextPassword: String!, $userId: ID!) {
    createOrUpdatePassword(
      input: { cleartextPassword: $cleartextPassword, userId: $userId }
    ) {
      id
    }
  }
`;

export async function createOrUpdatePassword(
  command: CreateOrUpdatePasswordInput,
): CreateOrUpdatePassword {
  const operation = {
    query: CREATE_OR_UPDATE_PASSWORD_MUTATION,
    variables: command,
  };

  return fetchManagement(operation) as CreateOrUpdatePassword;
}
