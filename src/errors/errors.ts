class UnhandledTokenType extends Error {
  readonly message = "UnhandledTokenType";
}

class EnvVar_IsJweSigned_MustBeABoolean extends Error {
  readonly message = "EnvVar_IsJweSigned_MustBeABoolean";
}

class UnhandledIdentityType extends Error {
  constructor(message: string) {
    super(message);
  }
}

class NoDBUserFoundError extends Error {
  readonly message = "No User found";
}

class NoUserCookieFoundError extends Error {
  readonly message = "No User found";
}

class SWRError extends Error {
  info: Record<string, string> = {};
  statusCode = 0;

  constructor(message: string) {
    super(message);
  }
}

export {
  UnhandledTokenType,
  EnvVar_IsJweSigned_MustBeABoolean,
  UnhandledIdentityType,
  NoDBUserFoundError,
  NoUserCookieFoundError,
  SWRError,
};
