import { JWTPayload } from "@fewlines/connect-client";
import { HttpStatus } from "@fwl/web";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { config, oauth2Client } from "@src/config";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import {
  getServerSideCookies,
  setServerSideCookies,
} from "@src/utils/server-side-cookies";
import { decryptVerifyAccessToken } from "@src/workflows/decrypt-verify-access-token";

export function withAuth(handler: Handler): Handler {
  return async (
    request: NextApiRequest,
    response: NextApiResponse,
  ): Promise<unknown> => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
    });

    if (userCookie) {
      const { access_token: currentAccessToken, sub } = userCookie;

      await decryptVerifyAccessToken(currentAccessToken).catch(
        async (error) => {
          if (error.name === "TokenExpiredError") {
            const user = await getDBUserFromSub(sub);

            if (user) {
              const {
                refresh_token,
                access_token,
              } = await oauth2Client.refreshTokens(user.refresh_token);

              const { sub } = await oauth2Client.verifyJWT<JWTPayload>(
                access_token,
                config.connectJwtAlgorithm,
              );

              await setServerSideCookies(
                response,
                "user-cookie",
                {
                  access_token,
                  sub,
                },
                {
                  shouldCookieBeSealed: true,
                  maxAge: 24 * 60 * 60,
                  path: "/",
                  httpOnly: true,
                  secure: true,
                },
              );

              await getAndPutUser({ sub, refresh_token }, user);

              response.statusCode = HttpStatus.OK;
              response.setHeader("location", request.headers.referer || "");
              response.end();
              return;
            } else {
              response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
              response.setHeader("location", "/");
              response.end();
              return;
            }
          }

          throw error;
        },
      );

      return handler(request, response);
    } else {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
  };
}
