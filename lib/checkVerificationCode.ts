import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../src/utils/fetchManagement";
import { IdentityTypes } from "./@types/Identity";

export type CheckVerificationCodeInput = {
  code: string;
  eventId: string;
};

enum CheckVerificationCodeStatus {
  EXPIRED = "EXPIRED",
  INVALID = "INVALID",
  NOT_FOUND = "NOT_FOUND",
  VALID = "VALID",
}

export type CheckVerificationCodeResult = {
  identityType: IdentityTypes;
  identityValue: string;
  nonce: string;
  status: CheckVerificationCodeStatus;
};

export type CheckVerificationCode = (
  command: CheckVerificationCodeInput,
) => Promise<
  | FetchResult<{
      sendIdentityValidationCode: CheckVerificationCodeResult;
    }>
  | Error
>;

const CHECK_VERIFICATION_CODE = gql`
  query checkVerificationCode($input: CheckVerificationCodeInput) {
    checkVerificationCode(input: $input) {
      identityType
      identityValue
      nonce
      status
      __typename
    }
  }
`;

export async function checkVerificationCode(
  command: CheckVerificationCodeInput,
): Promise<
  FetchResult<{
    sendIdentityValidationCode: CheckVerificationCodeResult;
  }>
> {
  const operation = {
    query: CHECK_VERIFICATION_CODE,
    variables: command,
  };

  return (await fetchManagement(operation)) as FetchResult<{
    sendIdentityValidationCode: CheckVerificationCodeResult;
  }>;
}
