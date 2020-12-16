export class ErrorSendingValidationCode extends Error {}

export class ErrorVerifyingValidationCode extends Error {}

export class ErrorSettingPassword extends Error {}

export class NoIdentityFound extends Error {
  readonly message = "No Identity Found";
}

export class NoIdentityAdded extends Error {
  readonly message = "No Identity Added";
}

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

export class NoUserFound extends Error {
  readonly message = "No User found";
}

export class NoDataReturned extends Error {
  readonly message = "No Data Returned";
}

export class NoProviderNameFound extends Error {
  readonly message = "No Provider Name Found";
}
