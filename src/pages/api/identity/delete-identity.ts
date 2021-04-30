import {
  ConnectUnreachableError,
  GraphqlErrors,
  IdentityTypes,
  removeIdentityFromUser,
} from "@fewlines/connect-management";
import {
  Endpoint,
  getServerSideCookies,
  HttpStatus,
  setAlertMessagesCookie,
} from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { getIdentityType } from "@src/utils/get-identity-type";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
  };

  return getTracer().span("delete-identity handler", async (span) => {
    const { type, value } = request.body;

    if (!type || !value) {
      throw webErrorFactory(webErrors.badRequest);
    }

    span.setDisclosedAttribute("Identity type", type);

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: configVariables.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }

    return removeIdentityFromUser(configVariables.managementCredentials, {
      userId: userCookie.sub,
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

        setAlertMessagesCookie(response, [generateAlertMessage(deleteMessage)]);

        response.statusCode = HttpStatus.ACCEPTED;
        response.setHeader("Content-Type", "application/json");
        response.end();
        return;
      })
      .catch((error) => {
        span.setDisclosedAttribute("is Identity removed", false);
        if (error instanceof GraphqlErrors) {
          throw webErrorFactory({
            ...webErrors.identityNotFound,
            parentError: error,
          });
        }

        if (error instanceof ConnectUnreachableError) {
          throw webErrorFactory({
            ...webErrors.connectUnreachable,
            parentError: error,
          });
        }

        throw error;
      });
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, {
      windowMs: 300000,
      requestsUntilBlock: 200,
    }),
    recoveryMiddleware(getTracer()),

    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  handler,
  "/api/identity/delete-identity",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .delete(wrappedHandler)
  .getHandler();
