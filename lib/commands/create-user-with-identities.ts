import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetch-management";
import type {
  CreateUserWithIdentitiesInput,
  User,
} from "../@types/provider-user";

const CREATE_USER_WITH_IDENTITIES_MUTATION = gql`
  mutation createUserWithIdentities(
    $identities: [IdentityInput]!
    $localeCode: String!
  ) {
    createUserWithIdentities(
      input: { identities: $identities, localeCode: $localeCode }
    ) {
      id
    }
  }
`;

export async function createUserWithIdentities(
  command: CreateUserWithIdentitiesInput,
): Promise<FetchResult> {
  const operation = {
    query: CREATE_USER_WITH_IDENTITIES_MUTATION,
    variables: command,
  };

  return fetchManagement(operation) as FetchResult<{
    createUserWithIdentities: User;
  }>;
}
