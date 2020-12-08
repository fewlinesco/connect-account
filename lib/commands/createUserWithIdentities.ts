import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import type {
  CreateUserWithIdentitiesInput,
  User,
} from "../@types/ProviderUser";

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
