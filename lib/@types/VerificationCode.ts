import { IdentityInput, IdentityTypes } from "./Identity";

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
