import {
  ConnectUnreachableError,
  getIdentity,
  GraphqlErrors,
  IdentityNotFoundError,
  IdentityTypes,
  removeIdentityFromUser,
} from "@fewlines/connect-management";
import {
  getServerSideCookies,
  Endpoint,
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
  Middleware,
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
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { getIdentityType } from "@src/utils/get-identity-type";

const get: Handler = async (request, response) => {
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

    const { id: identityId } = request.query;

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
    response.json(identity);
  });
};

const destroy: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
  };

  return getTracer().span("delete-identity handler", async (span) => {
    const { type, value, id } = request.body;

    if (!type || !value || id !== request.query.id) {
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
    const data = {
      userId: userCookie.sub,
      identityType: type,
      identityValue: value,
    };

    console.log("✅", data);

    return removeIdentityFromUser(configVariables.managementCredentials, data)
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
        console.log("❌");
        console.log(error);
        console.log("❌");
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

const middlewares: Middleware<NextApiRequest, NextApiResponse>[] = [
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
];

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrapMiddlewares(middlewares, get, "/api/identities/[id]"))
  .delete(wrapMiddlewares(middlewares, destroy, "/api/identities/[id]"))
  .getHandler();
