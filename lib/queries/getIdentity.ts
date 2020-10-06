import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import type { SingleIdentityProviderUser } from "@lib/@types/ProviderUser";
import { fetchManagement } from "@src/utils/fetchManagement";

const GET_USER_IDENTITY_QUERY = gql`
  query getUserIdentityQuery($userId: String!, $id: String!) {
    provider {
      id
      name
      user(filters: { userId: $userId }) {
        id
        identity(filters: { id: $id }) {
          id
          primary
          status
          type
          value
        }
      }
    }
  }
`;

export async function getIdentity(
  userId: string,
  id: string,
): Promise<FetchResult<{ provider: SingleIdentityProviderUser }>> {
  const operation = {
    query: GET_USER_IDENTITY_QUERY,
    variables: { userId, id },
  };

  return fetchManagement(operation) as FetchResult<{
    provider: SingleIdentityProviderUser;
  }>;
}
