import { FetchResult } from "apollo-link";

import { IdentityTypes } from "./Identity";

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
