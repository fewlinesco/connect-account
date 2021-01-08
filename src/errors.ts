import { HttpStatus, WebError, WebErrorMessages } from "@fwl/web";
import { GraphQLError } from "graphql";

import type { OAuth2Errors } from "./@types/oauth2/oauth2-errors";

const Errors: WebErrorMessages = {
  OAUTH2_ERROR: { code: 503001, message: "OAuth2Client Error" },
};

export function OAuth2Error(error?: OAuth2Errors): WebError {
  return new WebError({
    error: Errors.OAUTH2_ERROR,
    httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
    parentError: error,
  });
}

export class GraphqlError extends Error {
  parentError: GraphqlErrors;

  constructor(message: string, error: GraphqlErrors) {
    super(message);
    this.parentError = error;
  }
}
export class GraphqlErrors extends Error {
  constructor(errors: readonly GraphQLError[]) {
    const message = errors.map(({ message }) => message).join("\n");
    super(message);
  }
}

export class UnhandledTokenType extends Error {
  readonly message = "UnhandledTokenType";
}

export class EnvVar_IsJweSigned_MustBeABoolean extends Error {
  readonly message = "EnvVar_IsJweSigned_MustBeABoolean";
}
