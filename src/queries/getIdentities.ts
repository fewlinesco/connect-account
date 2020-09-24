import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import type { ProviderUser } from "@src/@types/ProviderUser";
import { fetchManagement } from "@src/utils/fetchManagement";

const USER_QUERY = gql`
  query getUserIdentitiesQuery($userId: String!) {
    provider {
      id
      name
      user(filters: { userId: $userId }) {
        id
        identities {
          id
          type
          value
          primary
          status
        }
      }
    }
  }
`;

export async function getIdentities(
  userId: string,
): Promise<FetchResult<{ provider: ProviderUser }>> {
  const operation = {
    query: USER_QUERY,
    variables: { userId },
  };

  return fetchManagement(operation) as FetchResult<{
    provider: ProviderUser;
  }>;
}
