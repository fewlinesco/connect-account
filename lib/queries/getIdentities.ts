import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import type { ProviderUser } from "@lib/@types/ProviderUser";
import { fetchManagement } from "@src/utils/fetchManagement";

const GET_USER_IDENTITIES_QUERY = gql`
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
    query: GET_USER_IDENTITIES_QUERY,
    variables: { userId },
  };

  return fetchManagement(operation) as FetchResult<{
    provider: ProviderUser;
  }>;
}
