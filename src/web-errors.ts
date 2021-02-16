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
  TEMPORARIES_IDENTITY_NOT_FOUND: {
    code: "temporaries_identity_not_found",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Temporary Identity list not found",
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
