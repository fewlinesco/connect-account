import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { fetchManagement } from "../src/utils/fetchManagement";

export enum IdentityTypes {
  APPLE = "APPLE",
  EMAIL = "EMAIL",
  FACEBOOK = "FACEBOOK",
  GITHUB = "GITHUB",
  GOOGLE = "GOOGLE",
  KAKAO_TALK = "KAKAO_TALK",
  LINE = "LINE",
  NAVER = "NAVER",
  PAYPAL = "PAYPAL",
  PHONE = "PHONE",
  PROVIDER = "PROVIDER",
  STRAVA = "STRAVA",
  VKONTAKTE = "VKONTAKTE",
}

export type IdentityInput = {
  userId: string;
  type: IdentityTypes;
  value: string;
};

export type SendIdentityVerificationCodeInput = {
  callbackUrl: string;
  identity: IdentityInput;
  localeCodeOverride?: string;
  userId: string;
};

export type SendIdentityValidationCodeResult = {
  callbackUrl: string;
  eventId: string;
  localeCode: string;
  nonce: string;
};

const SEND_IDENTITY_VALIDATION_CODE = gql`
  mutation sendIdentityValidationCode(
    input: {
      $callbackUrl: String!;
      $identity: IdentityInput!;
      $localeCodeOverride: String;
      $userId: String!;
    }
  ){
    sendIdentityValidationCode(
      input: {
        callbackUrl: $callbackUrl,
        identity: $identity,
        userId: $userId
      }
    ) {
      callbackUrl
      localeCode
      eventId
      nonce
      __typename
    }
  }
`;

export async function sendIdentityValidationCode(
  command: SendIdentityVerificationCodeInput,
): Promise<
  | FetchResult<{
      sendIdentityValidationCode: SendIdentityValidationCodeResult;
    }>
  | Error
> {
  const operation = {
    query: SEND_IDENTITY_VALIDATION_CODE,
    variables: command,
  };

  return (await fetchManagement(operation)) as
    | FetchResult<{
        sendIdentityValidationCode: SendIdentityValidationCodeResult;
      }>
    | Error;
}
