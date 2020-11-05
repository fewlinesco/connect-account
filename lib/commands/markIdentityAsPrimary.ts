import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../../src/utils/fetchManagement";
import { Identity } from "@lib/@types";

const MARK_IDENTITY_AS_PRIMARY_MUTATION = gql`
  mutation markIdentityAsPrimary($identityId: String!) {
    markIdentityAsPrimary(input: { identityId: $identityId }) {
      id
      primary
      status
      type
      value
    }
  }
`;

export async function markIdentityAsPrimary(
  identityId: Identity["id"],
): Promise<
  FetchResult<{
    markIdentityAsPrimary: Identity;
  }>
> {
  const operation = {
    query: MARK_IDENTITY_AS_PRIMARY_MUTATION,
    variables: { identityId },
  };

  return fetchManagement(operation) as FetchResult<{
    markIdentityAsPrimary: Identity;
  }>;
}
