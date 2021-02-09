import { JWTPayload } from "@fewlines/connect-client";
import {
  HttpStatus,
  getServerSideCookies,
  setServerSideCookies,
} from "@fwl/web";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { config, oauth2Client } from "@src/config";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import getTracer from "@src/tracer";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

const tracer = getTracer();

export function withAuth(handler: Handler): Handler {
  return async (
    request: NextApiRequest,
    response: NextApiResponse,
  ): Promise<unknown> => {
    return tracer.span("withAuth middleware", async (span) => {
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

              const user = await getDBUserFromSub(sub);

              if (user) {
                span.setDisclosedAttribute("user found on DB", true);

                const {
                  refresh_token,
                  access_token,
                } = await oauth2Client.refreshTokens(user.refresh_token);

                span.setDisclosedAttribute("is token refreshed", true);

                const { sub } = await oauth2Client.verifyJWT<JWTPayload>(
                  access_token,
                  config.connectJwtAlgorithm,
                );

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

                await getAndPutUser({ sub, refresh_token }, user);

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

        return handler(request, response);
      } else {
        span.setDisclosedAttribute("user cookie found", false);
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        response.end();
        return;
      }
    });
  };
}
