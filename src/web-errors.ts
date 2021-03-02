import { HttpStatus } from "@fwl/web";
import {
  ApplicationError,
  WebError,
  WebErrorDetails,
} from "@fwl/web/dist/errors";

const ERRORS_DATA = {
  BAD_REQUEST: {
    code: "bad_request",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Request malformed",
  },
  IDENTITY_INPUT_CANT_BE_BLANK: {
    code: "identity_input_cant_be_blank",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Identity input can't be blank",
  },
  INVALID_BODY: {
    code: "invalid_body",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Invalid body",
  },
  INVALID_VALIDATION_CODE: {
    code: "invalid_validation_code",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Invalid validation code",
  },
  EXPIRED_VALIDATION_CODE: {
    code: "expired_validation_code",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Expired validation code",
  },
  TEMPORARY_IDENTITY_EXPIRED: {
    code: "temporary_identity_expired",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Temporary Identity expired",
  },
  INVALID_PASSWORD_INPUT: {
    code: "invalid_password_input",
    httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
    message: "Invalid password input",
    errorDetails: {},
  },
  UNEXPECTED_ERROR: {
    code: "unexpected_error",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
  },
  CONNECT_UNREACHABLE: {
    code: "connect_unreachable",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Unable to reach Connect",
  },
  UNREACHABLE: {
    code: "unreachable",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Unable to reach the service",
  },
  DATABASE_UNREACHABLE: {
    code: "database_unreachable",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Unable to reach database",
  },
  IDENTITY_NOT_FOUND: {
    code: "identity_not_found",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Identity not found",
  },
  TEMPORARY_IDENTITY_NOT_FOUND: {
    code: "temporary_identity_not_found",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Temporary Identity not found",
  },
  TEMPORARY_IDENTITY_LIST_NOT_FOUND: {
    code: "temporary_identity_list_not_found",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Temporary Identity list not found",
  },
  NO_USER_FOUND: {
    code: "no_user_found",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "No user found",
  },
  COOKIE_DELETION_FAILED: {
    code: "cookie_deletion_failed",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Cookie deletion failed",
  },
};

const webErrorFactory = ({
  code,
  message,
  httpStatus,
  errorDetails,
}: {
  code: ApplicationError["code"];
  message: ApplicationError["message"];
  httpStatus: HttpStatus;
  errorDetails?: WebErrorDetails;
}): WebError =>
  new WebError({
    error: { code, message },
    httpStatus,
    errorDetails,
  });

export { webErrorFactory, ERRORS_DATA };
