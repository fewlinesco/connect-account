import { HttpStatus } from "@fwl/web";
import { ServerResponse } from "http";

import { refreshTokensFlow } from "@lib/commands/refreshTokensFlow";
import { DynamoUser } from "@src/@types/DynamoUser";
import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import { AccessToken } from "@src/@types/oAuth2/OAuth2Tokens";
import { getAndPutUser } from "@src/commands/getAndPutUser";
import { oauth2Client, config } from "@src/config";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";

export function withAuth(handler: Handler): Handler {
  return async (
    request: ExtendedRequest,
    response: ServerResponse,
  ): Promise<unknown> => {
    const userSession = request.session.get<UserCookie | undefined>(
      "user-session",
    );

    if (userSession) {
      try {
        const { access_token: currentAccessToken, sub } = userSession;
        const user = await getDBUserFromSub(sub);

        await oauth2Client
          .verifyJWT<AccessToken>(
            currentAccessToken,
            config.connectJwtAlgorithm,
          )
          .catch(async (error) => {
            if (error.name === "TokenExpiredError") {
              if (user) {
                const { refresh_token, access_token } = await refreshTokensFlow(
                  user.refresh_token as string,
                );

                const { sub } = await oauth2Client.verifyJWT<AccessToken>(
                  userSession.access_token,
                  config.connectJwtAlgorithm,
                );

                // Update access_token
                // request.session

                await getAndPutUser({ sub, refresh_token }, user as DynamoUser);
              } else {
                throw new Error("No user found");
              }
            } else {
              throw error;
            }
          });

        return handler(request, response);
      } catch (error) {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        response.end();
        return;
      }
    } else {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
  };
}
