import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import type { Application } from "@lib/@types/Application";

const GET_APPLICATION_QUERY = gql`
  query getUserIdentityQuery($id: String!) {
    provider {
      application(filters: { id: $id }) {
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
): Promise<FetchResult<{ provider: Application }>> {
  const operation = {
    query: GET_APPLICATION_QUERY,
    variables: { id },
  };

  return fetchManagement(operation) as FetchResult<{
    provider: Application;
  }>;
}
