import { HttpStatus, WebError, WebErrorMessages } from "@fwl/web";

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
