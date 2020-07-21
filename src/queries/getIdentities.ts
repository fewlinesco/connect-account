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
    variables: { userId: "5fab3a52-b242-4377-9e30-ae06589bebe6" },
  };

  return await fetchManagement(operation);
}
