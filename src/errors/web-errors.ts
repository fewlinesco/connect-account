import { HttpStatus } from "@fwl/web";
import {
  ApplicationError,
  WebError,
  WebErrorDetails,
} from "@fwl/web/dist/errors";

type WebErrorData = {
  code: ApplicationError["code"];
  message: ApplicationError["message"];
  httpStatus: HttpStatus;
  errorDetails?: WebErrorDetails;
  parentError?: Error;
};

const ERRORS_DATA: Record<string, WebErrorData> = {
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
  INVALID_PHONE_NUMBER_INPUT: {
    code: "invalid_phone_number_input",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Invalid phone number format input",
  },
  INVALID_IDENTITY_TYPE: {
    code: "invalid_identity_type",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Invalid identity type",
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
  NOT_FOUND: {
    code: "not_found",
    httpStatus: HttpStatus.NOT_FOUND,
    message: "Ressource not found",
  },
  INVALID_PASSWORD_INPUT: {
    code: "invalid_password_input",
    httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
    message: "Invalid password input",
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
  parentError,
}: WebErrorData): WebError =>
  new WebError({
    error: { code, message },
    httpStatus,
    errorDetails,
    parentError,
  });

export { webErrorFactory, ERRORS_DATA };