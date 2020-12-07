import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import type { IdentityInput } from "../@types/Identity";
import type { ProviderUserId } from "../@types/ProviderUser";

const GET_USER_FILTERS_BY_PROVIDER_QUERY = gql`
  query getUser($identities: IdentityInput!) {
    provider {
      user(filters: { identities: $identities }) {
        id
      }
    }
  }
`;

export async function getUserFiltersByProvider(
  identities: IdentityInput,
): Promise<FetchResult<{ provider: ProviderUserId }>> {
  const operation = {
    query: GET_USER_FILTERS_BY_PROVIDER_QUERY,
    variables: { identities },
  };

  return fetchManagement(operation) as FetchResult<{
    provider: ProviderUserId;
  }>;
}
