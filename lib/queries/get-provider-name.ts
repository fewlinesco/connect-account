import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "@src/utils/fetch-management";

const GET_PROVIDER_NAME_QUERY = gql`
  query getProviderName {
    provider {
      name
    }
  }
`;

export async function getProviderName(): Promise<
  FetchResult<{ provider: { name: string } }>
> {
  const operation = {
    query: GET_PROVIDER_NAME_QUERY,
    variables: {},
  };

  return fetchManagement(operation) as FetchResult<{
    provider: { name: string };
  }>;
}
