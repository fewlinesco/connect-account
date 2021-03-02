import { UnreachableError } from "@fewlines/connect-client";
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
import { config, oauth2Client } from "@src/config";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { ERRORS_DATA, webErrorFactory } from "@src/web-errors";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

async function authentication(
  tracer: Tracer,
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const webErrors = {
    unreachable: ERRORS_DATA.UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
  };

  return tracer.span("auth-middleware", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: config.cookieSalt,
    });

    if (userCookie) {
      span.setDisclosedAttribute("user cookie found", true);
      const { access_token: currentAccessToken, sub } = userCookie;

      await decryptVerifyAccessToken(currentAccessToken).catch(
        async (error) => {
          if (error.name === "TokenExpiredError") {
            span.setDisclosedAttribute("is access_token expired", true);
            const user = await getDBUserFromSub(sub).catch(() => {
              span.setDisclosedAttribute("database reachable", false);
              throw webErrorFactory(webErrors.databaseUnreachable);
            });
            span.setDisclosedAttribute("database reachable", true);

            if (user) {
              span.setDisclosedAttribute("user found on DB", true);
              const {
                refresh_token,
                access_token,
              } = await oauth2Client
                .refreshTokens(user.refresh_token)
                .catch((error) => {
                  span.setDisclosedAttribute("is token refreshed", false);
                  if (error instanceof UnreachableError) {
                    throw webErrorFactory(webErrors.unreachable);
                  }

                  throw error;
                });
              span.setDisclosedAttribute("is token refreshed", true);

              const { sub } = await decryptVerifyAccessToken(
                access_token,
              ).catch((error) => {
                span.setDisclosedAttribute("is access_token valid", false);
                if (error instanceof UnreachableError) {
                  throw webErrorFactory(webErrors.unreachable);
                }

                throw error;
              });
              span.setDisclosedAttribute("is access_token valid", true);

              await setServerSideCookies(
                response,
                "user-cookie",
                {
                  access_token,
                  sub,
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

              await getAndPutUser({ sub, refresh_token }, user).catch(() => {
                span.setDisclosedAttribute("database reachable", false);
                throw webErrorFactory(webErrors.databaseUnreachable);
              });
              span.setDisclosedAttribute("user updated on DB", true);

              response.statusCode = HttpStatus.OK;
              response.setHeader("location", request.headers.referer || "");
              response.end();
              return;
            } else {
              span.setDisclosedAttribute("user found on DB", false);
              response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
              response.setHeader("location", "/");
              response.end();
              return;
            }
          }
          span.setDisclosedAttribute("decryptVerifyError", error);
          throw error;
        },
      );

      span.setDisclosedAttribute("is access_token valid", true);
    } else {
      span.setDisclosedAttribute("user cookie found", false);
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
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
      await authentication(tracer, request, response);

      return handler(request, response);
    };
  };
}

export { authMiddleware };
