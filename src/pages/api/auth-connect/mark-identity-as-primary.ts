import {
  ConnectUnreachableError,
  GraphqlErrors,
  markIdentityAsPrimary,
} from "@fewlines/connect-management";
import { getServerSideCookies, Endpoint, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { withSentry } from "@src/middlewares/with-sentry";
import getTracer from "@src/tracer";
import { isMarkingIdentityAsPrimaryAuthorized } from "@src/utils/is-marking-identity-as-primary-authorized";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";

const handler: Handler = async (request, response) => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    invalidBody: ERRORS_DATA.INVALID_BODY,
  };

  return getTracer().span("mark-identity-as-primary handler", async (span) => {
    const { identityId } = request.body;

    if (!identityId) {
      throw webErrorFactory(webErrors.invalidBody);
    }

    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: config.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }

    const isAuthorized = await isMarkingIdentityAsPrimaryAuthorized(
      userCookie.sub,
      identityId,
    );

    if (!isAuthorized) {
      span.setDisclosedAttribute(
        "is mark Identity as primary authorized",
        false,
      );

      throw webErrorFactory(webErrors.badRequest);
    }

    span.setDisclosedAttribute("is mark Identity as primary authorized", true);

    return markIdentityAsPrimary(config.managementCredentials, identityId)
      .then(() => {
        span.setDisclosedAttribute("is Identity marked as primary", true);

        response.statusCode = HttpStatus.OK;
        response.setHeader("Content-type", "application/json");
        response.end();
        return;
      })
      .catch((error) => {
        span.setDisclosedAttribute("is Identity marked as primary", false);

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
    withSentry,
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  handler,
  "/api/auth-connect/mark-identity-as-primary",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
