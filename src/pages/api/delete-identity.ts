import {
  ConnectUnreachableError,
  GraphqlErrors,
  IdentityTypes,
  removeIdentityFromUser,
} from "@fewlines/connect-management";
import { Endpoint, HttpStatus, setAlertMessagesCookie } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { getIdentityType } from "@src/utils/get-identity-type";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
  };

  return getTracer().span("delete-identity handler", async (span) => {
    const { userId, type, value } = request.body;

    if ([userId, type, value].includes(undefined)) {
      throw webErrorFactory(webErrors.badRequest);
    }

    span.setDisclosedAttribute("Identity type", type);

    return removeIdentityFromUser(config.managementCredentials, {
      userId,
      identityType: type,
      identityValue: value,
    })
      .then(() => {
        span.setDisclosedAttribute("is Identity removed", true);

        const deleteMessage = `${
          getIdentityType(type) === IdentityTypes.EMAIL
            ? "Email address"
            : "Phone number"
        } has been deleted`;

        setAlertMessagesCookie(response, deleteMessage);

        response.statusCode = HttpStatus.ACCEPTED;
        response.setHeader("Content-Type", "application/json");
        response.end();
        return;
      })
      .catch((error) => {
        if (error instanceof GraphqlErrors) {
          throw webErrorFactory(webErrors.identityNotFound);
        }

        if (error instanceof ConnectUnreachableError) {
          throw webErrorFactory(webErrors.connectUnreachable);
        }

        throw error;
      });
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    recoveryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    withSentry,
    withAuth,
  ],
  handler,
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .delete(wrappedHandler)
  .getHandler();
