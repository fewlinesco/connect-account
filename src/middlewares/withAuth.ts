import { HttpStatus } from "@fwl/web";
import { NextApiRequest, NextApiResponse } from "next";

import { refreshTokensFlow } from "@lib/commands/refreshTokensFlow";
import { UserCookie } from "@src/@types/UserCookie";
import { Handler } from "@src/@types/core/Handler";
import { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { getAndPutUser } from "@src/commands/getAndPutUser";
import { config, oauth2Client } from "@src/config";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";
import {
  getServerSideCookies,
  setServerSideCookies,
} from "@src/utils/serverSideCookies";
import { decryptVerifyAccessToken } from "@src/workflows/decryptVerifyAccessToken";

export function withAuth(handler: Handler): Handler {
  return async (
    request: NextApiRequest,
    response: NextApiResponse,
  ): Promise<unknown> => {
    const userCookie = await getServerSideCookies<UserCookie>(
      request,
      response,
      "user-cookie",
      true,
    );

    if (userCookie) {
      const { access_token: currentAccessToken, sub } = userCookie;

      await decryptVerifyAccessToken(currentAccessToken).catch(
        async (error) => {
          if (error.name === "TokenExpiredError") {
            const user = await getDBUserFromSub(sub);

            if (user) {
              const { refresh_token, access_token } = await refreshTokensFlow(
                user.refresh_token,
              );

              const { sub } = await oauth2Client.verifyJWT<AccessToken>(
                access_token,
                config.connectJwtAlgorithm,
              );

              await setServerSideCookies(
                request,
                response,
                "user-cookie",
                {
                  access_token,
                  sub,
                },
                {
                  shouldCookieBeSealed: true,
                  maxAge: 24 * 60 * 60 * 1000,
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
