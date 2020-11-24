import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import { Application } from "../@types/Application";

const UPDATE_APPLICATION_MUTATION = gql`
  mutation updateApplication(
    $id: String!
    $description: String!
    $name: String!
    $redirectUris: [String]!
    $defaultHomePage: String!
  ) {
    updateApplication(
      input: {
        id: $id
        description: $description
        name: $name
        redirectUris: $redirectUris
        defaultHomePage: $defaultHomePage
      }
    ) {
      id
      description
      redirectUris
      name
      defaultHomePage
    }
  }
`;

export async function updateApplication(
  command: Application,
): Promise<FetchResult> {
  const operation = {
    query: UPDATE_APPLICATION_MUTATION,
    variables: command,
  };

  return fetchManagement(operation) as FetchResult<{
    updateApplication: Application;
  }>;
}
