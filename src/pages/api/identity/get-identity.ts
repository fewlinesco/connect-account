import {
  ConnectUnreachableError,
  getIdentity,
  GraphqlErrors,
  IdentityNotFoundError,
} from "@fewlines/connect-management";
import { getServerSideCookies, Endpoint, HttpStatus } from "@fwl/web";
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
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const handler: Handler = async (request, response) => {
  const webErrors = {
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    graphqlErrors: ERRORS_DATA.GRAPHQL_ERRORS,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    invalidQueryString: ERRORS_DATA.INVALID_QUERY_STRING,
  };

  return getTracer().span("get-identity handler", async (span) => {
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

    const identityId = request.query.identityId;

    if (!identityId || typeof identityId !== "string") {
      throw webErrorFactory(webErrors.invalidQueryString);
    }

    const identity = await getIdentity(configVariables.managementCredentials, {
      userId: userCookie.sub,
      identityId,
    }).catch((error) => {
      span.setDisclosedAttribute("is Identity fetched", false);

      if (error instanceof IdentityNotFoundError) {
        throw webErrorFactory({
          ...webErrors.identityNotFound,
        });
      }

      if (error instanceof GraphqlErrors) {
        throw webErrorFactory({
          ...webErrors.graphqlErrors,
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

    span.setDisclosedAttribute("is Identity fetched", true);
    response.statusCode = HttpStatus.OK;
    response.json({ identity });
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
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  handler,
  "/api/identity/get-identity",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
