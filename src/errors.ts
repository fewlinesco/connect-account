import { HttpStatus, WebError, WebErrorMessages } from "@fwl/web";
import { GraphQLError } from "graphql";

import type { OAuth2Errors } from "./@types/oAuth2/OAuth2Errors";

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

export class MongoUpdateError extends Error {}

export class MongoInsertError extends Error {}

export class MongoNoDataReturned extends Error {}

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

export class TemporaryIdentityExpired extends Error {}
