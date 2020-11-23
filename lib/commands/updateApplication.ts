import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import { ApplicationInput } from "@lib/@types/Application";

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
      description
      redirectUris
      name
      defaultHomePage
    }
  }
`;

export async function updateApplication(
  command: ApplicationInput,
): Promise<FetchResult> {
  const operation = {
    query: UPDATE_APPLICATION_MUTATION,
    variables: command,
  };

  return fetchManagement(operation) as FetchResult;
}
