import { HttpStatus } from "@fwl/web";
import { ServerResponse } from "http";

import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { oauth2Client, config } from "@src/config";
import { handleAuthErrors } from "@src/handlers/handleAuthErrors";
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
      console.log(userSession);

      const { access_token: currentAccessToken, sub } = userSession;

      try {
        await getDBUserFromSub(sub);

        await oauth2Client.verifyJWT<AccessToken>(
          currentAccessToken,
          config.connectJwtAlgorithm,
        );

        return handler(request, response);
      } catch (error) {
        return handleAuthErrors(request, response, error, sub);
      }
    } else {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
  };
}
