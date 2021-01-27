import { Endpoint, HttpStatus } from "@fwl/web";
import {
  errorMiddleware,
  loggingMiddleware,
  recoveryMiddleware,
  tracingMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/core/Handler";
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { oauth2Client } from "@src/config";
import { logger } from "@src/logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import getTracer from "@src/tracer";
import { setServerSideCookies } from "@src/utils/server-side-cookies";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

const tracer = getTracer();

const handler: Handler = (request, response): Promise<void> => {
  return tracer.span("callback handler", async (span) => {
    const {
      access_token,
      refresh_token,
    } = await oauth2Client.getTokensFromAuthorizationCode(
      `${request.query.code}`,
    );

    span.setDisclosedAttribute("`authorization_code`", request.query.code);

    const decodedAccessToken = await decryptVerifyAccessToken(access_token);

    span.setDisclosedAttribute("Is `access_token` valid", true);

    const oAuth2UserInfo = {
      sub: decodedAccessToken.sub,
      refresh_token,
    };

    await getAndPutUser(oAuth2UserInfo);

    span.setDisclosedAttribute("Is User put", true);

    await setServerSideCookies(
      response,
      "user-cookie",
      {
        access_token,
        sub: decodedAccessToken.sub,
      },
      {
        shouldCookieBeSealed: true,
        maxAge: 24 * 60 * 60,
        path: "/",
        httpOnly: true,
        secure: true,
      },
    );

    span.setDisclosedAttribute("Is cookie set", true);

    response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
      Location: "/account",
    });

    response.end();
    return;
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(tracer),
    recoveryMiddleware(tracer),
    errorMiddleware(tracer),
    loggingMiddleware(tracer, logger),
    withSentry,
  ],
  handler,
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
