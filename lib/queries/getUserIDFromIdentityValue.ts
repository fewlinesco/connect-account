import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import type { IdentityValueInput } from "../@types/Identity";
import type { ProviderUserId } from "../@types/ProviderUser";

const GET_USER_ID_FROM_IDENTITY_VALUE_QUERY = gql`
  query getUser($identities: IdentityInput!) {
    provider {
      user(filters: { identities: $identities }) {
        id
      }
    }
  }
`;

export async function getUserIDFromIdentityValue(
  identities: IdentityValueInput,
): Promise<FetchResult<{ provider: ProviderUserId }>> {
  const operation = {
    query: GET_USER_ID_FROM_IDENTITY_VALUE_QUERY,
    variables: { identities },
  };

  return fetchManagement(operation) as FetchResult<{
    provider: ProviderUserId;
  }>;
}
