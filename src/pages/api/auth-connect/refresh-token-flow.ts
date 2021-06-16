import {
  AlgoNotSupportedError,
  InvalidAudienceError,
  InvalidKeyIDRS256Error,
  MissingJWKSURIError,
  MissingKeyIDHS256Error,
  UnreachableError,
} from "@fewlines/connect-client";
import {
  Endpoint,
  getServerSideCookies,
  setServerSideCookies,
  HttpStatus,
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
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import { oauth2Client } from "@src/configs/oauth2-client";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { NoDBUserFoundError, UnhandledTokenType } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    unreachable: ERRORS_DATA.UNREACHABLE,
    badRequest: ERRORS_DATA.BAD_REQUEST,
  };

  return getTracer().span("refresh-token-flow handler", async (span) => {
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

    const { sub } = userCookie;

    const user = await getDBUserFromSub(sub).catch((error) => {
      span.setDisclosedAttribute("database reachable", false);
      throw webErrorFactory({
        ...webErrors.databaseUnreachable,
        parentError: error,
      });
    });
    span.setDisclosedAttribute("database reachable", true);

    if (!user) {
      span.setDisclosedAttribute("user found on DB", false);
      throw new NoDBUserFoundError();
    }
    span.setDisclosedAttribute("user found on DB", true);

    if (!user.refresh_token) {
      span.setDisclosedAttribute("user's refresh token found", false);
      throw new NoDBUserFoundError();
    }
    span.setDisclosedAttribute("user's refresh token found", true);

    const refreshedTokens = await oauth2Client
      .refreshTokens(user.refresh_token)
      .catch((error) => {
        span.setDisclosedAttribute("is token refreshed", false);
        if (error instanceof UnreachableError) {
          throw webErrorFactory({
            ...webErrors.unreachable,
            parentError: error,
          });
        }

        throw error;
      });
    span.setDisclosedAttribute("is token refreshed", true);

    await decryptVerifyAccessToken(refreshedTokens.access_token).catch(
      (error) => {
        span.setDisclosedAttribute("is access_token valid", false);
        if (
          error instanceof MissingJWKSURIError ||
          error instanceof InvalidAudienceError ||
          error instanceof MissingKeyIDHS256Error ||
          error instanceof AlgoNotSupportedError ||
          error instanceof InvalidKeyIDRS256Error ||
          error instanceof UnhandledTokenType
        ) {
          throw webErrorFactory({
            ...webErrors.badRequest,
            parentError: error,
          });
        }

        if (error instanceof UnreachableError) {
          throw webErrorFactory({
            ...webErrors.unreachable,
            parentError: error,
          });
        }

        throw error;
      },
    );
    span.setDisclosedAttribute("is refresh access_token valid", true);

    await setServerSideCookies(
      response,
      "user-cookie",
      {
        access_token: refreshedTokens.access_token,
        sub,
      },
      {
        shouldCookieBeSealed: true,
        cookieSalt: configVariables.cookieSalt,
        maxAge: 24 * 60 * 60,
        path: "/",
        httpOnly: true,
        secure: true,
      },
    );

    span.setDisclosedAttribute("is cookie set", true);

    await getAndPutUser(
      {
        sub,
        refresh_token: refreshedTokens.refresh_token,
        locale: user.locale,
      },
      user,
    ).catch((error) => {
      span.setDisclosedAttribute("database reachable", false);
      throw webErrorFactory({
        ...webErrors.databaseUnreachable,
        parentError: error,
      });
    });

    span.setDisclosedAttribute("user updated on DB", true);

    console.log("NEXT: ", request.query.next);

    response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
    response.setHeader("location", `${request.query.next}`);
    response.end();
    return;
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
  ],
  handler,
  "/api/auth-connect/refresh-token-flow",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
