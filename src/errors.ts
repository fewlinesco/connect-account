import { HttpStatus, WebError, WebErrorMessages } from "@fwl/web";
import { GraphQLError } from "graphql";

import { OAuth2Errors } from "./@types/OAuth2Errors";

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

export class GraphqlErrors extends Error {
  parentErrors: string;

  constructor(errors: readonly GraphQLError[]) {
    super();
    this.parentErrors = errors.map(({ message }) => message).join(" | ");
  }
}

export class TemporaryIdentityExpired extends Error {}
