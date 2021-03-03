class UnhandledTokenType extends Error {
  readonly message = "UnhandledTokenType";
}

class EnvVar_IsJweSigned_MustBeABoolean extends Error {
  readonly message = "EnvVar_IsJweSigned_MustBeABoolean";
}

class ErrorSendingValidationCode extends Error {}

class ErrorSettingPassword extends Error {}

class IdentityAlreadyUsed extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

class PhoneNumberInputValueShouldBeANumber extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

class UnhandledIdentityType extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

class InvalidValidationCode extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

class NoUserFoundError extends Error {
  readonly message = "No User found";
}

class TemporaryIdentityExpired extends Error {
  readonly message = "Temporary Identity Expired";
}

class DeleteUserCookieError extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

export {
  UnhandledTokenType,
  EnvVar_IsJweSigned_MustBeABoolean,
  ErrorSendingValidationCode,
  ErrorSettingPassword,
  IdentityAlreadyUsed,
  PhoneNumberInputValueShouldBeANumber,
  UnhandledIdentityType,
  InvalidValidationCode,
  NoUserFoundError,
  TemporaryIdentityExpired,
  DeleteUserCookieError,
};
