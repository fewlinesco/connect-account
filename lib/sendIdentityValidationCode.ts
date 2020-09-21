import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../src/utils/fetchManagement";
import { IdentityTypes } from "./@types/Identity";

export enum IdentityStatus {
  UNVALIDATED = "UNVALIDATED",
  VALIDATED = "VALIDATED",
}

export type IdentityInput = {
  status: IdentityStatus;
  type: IdentityTypes;
  value: string;
};

export type SendIdentityVerificationCodeInput = {
  callbackUrl: string;
  identity: IdentityInput;
  localeCodeOverride?: string;
  userId?: string;
};

export type SendIdentityValidationCodeResult = {
  callbackUrl: string;
  eventId: string;
  localeCode: string;
  nonce: string;
};

export type SendIdentityValidationCode = (
  command: SendIdentityVerificationCodeInput,
) => Promise<
  | FetchResult<{
      sendIdentityValidationCode: SendIdentityValidationCodeResult;
    }>
  | Error
>;

const SEND_IDENTITY_VALIDATION_CODE = gql`
  mutation sendIdentityValidationCode(
    $callbackUrl: String!
    $identity: IdentityInput!
    $localeCodeOverride: String
    $userId: String
  ) {
    sendIdentityValidationCode(
      input: {
        callbackUrl: $callbackUrl
        identity: $identity
        localeCodeOverride: $localeCodeOverride
        userId: $userId
      }
    ) {
      callbackUrl
      localeCode
      eventId
      nonce
    }
  }
`;

export async function sendIdentityValidationCode(
  command: SendIdentityVerificationCodeInput,
): Promise<
  FetchResult<{
    sendIdentityValidationCode: SendIdentityValidationCodeResult;
  }>
> {
  const operation = {
    query: SEND_IDENTITY_VALIDATION_CODE,
    variables: command,
  };

  return (await fetchManagement(operation)) as FetchResult<{
    sendIdentityValidationCode: SendIdentityValidationCodeResult;
  }>;
}
