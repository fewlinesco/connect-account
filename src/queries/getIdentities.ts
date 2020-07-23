import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../utils/fetchManagement";

const USER_QUERY = gql`
  query getUserIdentitiesQuery($userId: String!) {
    provider {
      id
      name
      user(filters: { userId: $userId }) {
        id
        identities {
          type
          value
          primary
          status
        }
      }
    }
  }
`;

export async function getIdentities(): Promise<FetchResult | Error> {
  const operation = {
    query: USER_QUERY,
    variables: { userId: process.env.DEV_USER_ID },
  };

  return await fetchManagement(operation);
}
