import { HttpStatus } from "@fwl/web";
import {
  ApplicationError,
  WebError,
  WebErrorDetails,
} from "@fwl/web/dist/errors";

const ERRORS_DATA = {
  BAD_REQUEST: {
    code: "unexpected_error",
    httpStatus: HttpStatus.BAD_REQUEST,
    message: "Request malformed",
  },
  UNEXPECTED_ERROR: {
    code: "unexpected_error",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
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
