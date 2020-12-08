export class ErrorSendingValidationCode extends Error {}

export class ErrorVerifyingValidationCode extends Error {}

export class ErrorSettingPassword extends Error {}

export class NoIdentityFound extends Error {}

export class IdentityAlreadyUsed extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class IdentityInputValueCantBeBlank extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class PhoneNumberInputValueShouldBeANumber extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class UnhandledIdentityType extends Error {
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}
