import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import type { CheckVerificationCodeResult } from "@lib/@types/verification-code";
import { fetchManagement } from "@src/utils/fetch-management";

const CHECK_VERIFICATION_CODE_QUERY = gql`
  query checkVerificationCodeQuery($code: String!, $eventId: String!) {
    checkVerificationCode(input: { code: $code, eventId: $eventId }) {
      identityType
      identityValue
      nonce
      status
    }
  }
`;

export async function checkVerificationCode(
  code: string,
  eventId: string,
): Promise<
  FetchResult<{ checkVerificationCode: CheckVerificationCodeResult }>
> {
  const operation = {
    query: CHECK_VERIFICATION_CODE_QUERY,
    variables: { code, eventId },
  };

  return fetchManagement(operation) as FetchResult<{
    checkVerificationCode: CheckVerificationCodeResult;
  }>;
}
