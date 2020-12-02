// import { ResourceNotFoundException } from "@aws-sdk/client-dynamodb";
import { HttpStatus } from "@fwl/web";
import { ServerResponse } from "http";

import { refreshTokensFlow } from "@lib/commands/refreshTokensFlow";
import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { getAndPutUser } from "@src/commands/getAndPutUser";
import { config, oauth2Client } from "@src/config";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";

export async function handleAuthErrors(
  request: ExtendedRequest,
  response: ServerResponse,
  error: Error,
  sub: string,
): Promise<void> {
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

      request.session.set<UserCookie>("user-session", {
        access_token,
        sub,
      });

      await getAndPutUser({ sub, refresh_token }, user);
    } else {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
  }

  if (error.message === "Cannot do operations on a non-existent table") {
    response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
    response.setHeader("location", "/");
    response.end();
    return;
  }

  throw error;
}
