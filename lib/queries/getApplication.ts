import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import type { ProviderApplication } from "../@types/Application";

const GET_APPLICATION_QUERY = gql`
  query getApplicationQuery($id: String!) {
    provider {
      application(filters: { id: $id }) {
        id
        defaultHomePage
        redirectUris
        name
        description
      }
    }
  }
`;

export async function getApplication(
  id: string,
): Promise<FetchResult<{ provider: ProviderApplication }>> {
  const operation = {
    query: GET_APPLICATION_QUERY,
    variables: { id },
  };

  return fetchManagement(operation) as FetchResult<{
    provider: ProviderApplication;
  }>;
}
