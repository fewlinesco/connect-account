import { Endpoint, HttpStatus, setServerSideCookies } from "@fwl/web";
import {
  errorMiddleware,
  loggingMiddleware,
  rateLimitingMiddleware,
  recoveryMiddleware,
  tracingMiddleware,
  wrapMiddlewares,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { oauth2Client, config } from "@src/config";
import { logger } from "@src/logger";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import getTracer from "@src/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
  };

  return getTracer().span("callback handler", async (span) => {
    const {
      access_token,
      refresh_token,
    } = await oauth2Client.getTokensFromAuthorizationCode(
      `${request.query.code}`,
    );

    span.setAttribute("authorization_code", request.query.code);
    span.setDisclosedAttribute("query.error", request.query.error);

    const decodedAccessToken = await decryptVerifyAccessToken(access_token);

    span.setDisclosedAttribute("is access_token valid", true);

    const oAuth2UserInfo = {
      sub: decodedAccessToken.sub,
      refresh_token,
    };

    await getAndPutUser(oAuth2UserInfo).catch(() => {
      span.setDisclosedAttribute("database reachable", false);

      throw webErrorFactory(webErrors.databaseUnreachable);
    });

    span.setDisclosedAttribute("user updated on DB", true);

    await setServerSideCookies(
      response,
      "user-cookie",
      {
        access_token,
        sub: decodedAccessToken.sub,
      },
      {
        shouldCookieBeSealed: true,
        cookieSalt: config.cookieSalt,
        maxAge: 24 * 60 * 60,
        path: "/",
        httpOnly: true,
        secure: true,
      },
    );

    span.setDisclosedAttribute("is cookie set", true);

    response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
      Location: "/account",
    });

    response.end();
    return;
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
  ],
  handler,
  "/api/oauth/callback",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
