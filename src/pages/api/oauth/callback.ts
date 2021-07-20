import {
  AlgoNotSupportedError,
  InvalidAudienceError,
  InvalidKeyIDRS256Error,
  MissingJWKSURIError,
  MissingKeyIDHS256Error,
  UnreachableError,
} from "@fewlines/connect-client";
import { Endpoint, HttpStatus, setServerSideCookies } from "@fwl/web";
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { configVariables } from "@src/configs/config-variables";
import { getLocaleFromRequest } from "@src/configs/intl";
import { logger } from "@src/configs/logger";
import { oauth2Client } from "@src/configs/oauth2-client";
import getTracer from "@src/configs/tracer";
import { UnhandledTokenType } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { noAuthBasicMiddlewares } from "@src/middlewares/basic-middlewares";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    unreachable: ERRORS_DATA.UNREACHABLE,
    badRequest: ERRORS_DATA.BAD_REQUEST,
  };

  return getTracer().span("callback handler", async (span) => {
    const { access_token, refresh_token } = await oauth2Client
      .getTokensFromAuthorizationCode(`${request.query.code}`)
      .catch((error) => {
        if (error instanceof UnreachableError) {
          span.setAttribute("authorization_code", "failed");

          throw webErrorFactory({
            ...webErrors.unreachable,
            parentError: error,
          });
        }

        throw error;
      });
    span.setAttribute("authorization_code", request.query.code);
    span.setDisclosedAttribute("query.error", request.query.error);

    const decodedAccessToken = await decryptVerifyAccessToken(
      access_token,
    ).catch((error) => {
      span.setDisclosedAttribute("is access_token valid", false);
      if (
        error instanceof MissingJWKSURIError ||
        error instanceof InvalidAudienceError ||
        error instanceof MissingKeyIDHS256Error ||
        error instanceof AlgoNotSupportedError ||
        error instanceof InvalidKeyIDRS256Error ||
        error instanceof UnhandledTokenType
      ) {
        throw webErrorFactory({ ...webErrors.badRequest, parentError: error });
      }

      if (error instanceof UnreachableError) {
        throw webErrorFactory({
          ...webErrors.unreachable,
          parentError: error,
        });
      }

      throw error;
    });
    span.setDisclosedAttribute("is access_token valid", true);

    const oAuth2UserInfo = {
      sub: decodedAccessToken.sub,
      refresh_token,
    };

    await getAndPutUser(oAuth2UserInfo).catch((error) => {
      span.setDisclosedAttribute("database reachable", false);
      throw webErrorFactory({
        ...webErrors.databaseUnreachable,
        parentError: error,
      });
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
        cookieSalt: configVariables.cookieSalt,
        maxAge: 24 * 60 * 60,
        path: "/",
        httpOnly: true,
        secure: true,
      },
    );
    span.setDisclosedAttribute("is cookie set", true);

    const locale = getLocaleFromRequest(request, span);
    span.setDisclosedAttribute("locale", locale);

    response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
      Location: locale === "en" ? "/account" : `/${locale}/account`,
    });
    response.end();
    return;
  });
};

const wrappedHandler = wrapMiddlewares(
  noAuthBasicMiddlewares(getTracer(), logger),
  handler,
  "/api/oauth/callback",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
