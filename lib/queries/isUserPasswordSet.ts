import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import type { ProviderUserPasswordSet } from "@lib/@types/ProviderUser";
import { fetchManagement } from "@src/utils/fetchManagement";

const IS_USER_PASSWORD_SET_QUERY = gql`
  query isUserPasswordSet($userId: String!) {
    provider {
      id
      name
      user(filters: { userId: $userId }) {
        id
        passwords {
          available
        }
      }
    }
  }
`;

export async function isUserPasswordSet(
  userId: string,
): Promise<FetchResult<{ provider: ProviderUserPasswordSet }>> {
  const operation = {
    query: IS_USER_PASSWORD_SET_QUERY,
    variables: { userId },
  };

  return fetchManagement(operation) as FetchResult<{
    provider: ProviderUserPasswordSet;
  }>;
}
