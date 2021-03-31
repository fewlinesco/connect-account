import {
  AlgoNotSupportedError,
  InvalidAudienceError,
  InvalidKeyIDRS256Error,
  MissingJWKSURIError,
  MissingKeyIDHS256Error,
  UnreachableError,
} from "@fewlines/connect-client";
import { Tracer } from "@fwl/tracing";
import {
  HttpStatus,
  getServerSideCookies,
  setServerSideCookies,
} from "@fwl/web";
import { Middleware } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { UserCookie } from "@src/@types/user-cookie";
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { configVariables } from "@src/configs/config-variables";
import { oauth2Client } from "@src/configs/oauth2-client";
import {
  NoDBUserFoundError,
  NoUserCookieFoundError,
  UnhandledTokenType,
} from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

async function authentication(
  tracer: Tracer,
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const webErrors = {
    unreachable: ERRORS_DATA.UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    badRequest: ERRORS_DATA.BAD_REQUEST,
  };

  return tracer.span("auth-middleware", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: configVariables.cookieSalt,
    });

    if (!userCookie) {
      span.setDisclosedAttribute("user cookie found", false);
      throw new NoUserCookieFoundError();
    }
    span.setDisclosedAttribute("user cookie found", true);

    const { access_token: currentAccessToken, sub } = userCookie;

    await decryptVerifyAccessToken(currentAccessToken).catch(async (error) => {
      if (error.name === "TokenExpiredError") {
        span.setDisclosedAttribute("is access_token expired", true);

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
        span.setDisclosedAttribute("is access_token valid", true);

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
          { sub, refresh_token: refreshedTokens.refresh_token },
          user,
        ).catch((error) => {
          span.setDisclosedAttribute("database reachable", false);
          throw webErrorFactory({
            ...webErrors.databaseUnreachable,
            parentError: error,
          });
        });

        span.setDisclosedAttribute("user updated on DB", true);

        response.statusCode = HttpStatus.OK;
        response.setHeader("location", request.headers.referer || "");
        response.end();
        return;
      }

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
    });

    span.setDisclosedAttribute("is access_token valid", true);
  });
}

function authMiddleware(
  tracer: Tracer,
): Middleware<NextApiRequest, NextApiResponse> {
  return (handler) => {
    return async (
      request: NextApiRequest,
      response: NextApiResponse,
    ): Promise<void> => {
      return await authentication(tracer, request, response)
        .then(() => handler(request, response))
        .catch((error) => {
          if (
            error instanceof NoDBUserFoundError ||
            error instanceof NoUserCookieFoundError
          ) {
            response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
            response.setHeader("location", "/");
            return { props: {} };
          }

          throw error;
        });
    };
  };
}

export { authMiddleware };
