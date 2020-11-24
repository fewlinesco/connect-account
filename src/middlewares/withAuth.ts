import { HttpStatus } from "@fwl/web";
import { ServerResponse } from "http";
import { ObjectId } from "mongodb";

import { MongoUser } from "@lib/@types";
import { refreshTokensFlow } from "@lib/commands/refreshTokensFlow";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { Handler } from "@src/@types/Handler";
import { updateAccessAndRefreshTokens } from "@src/commands/updateAccessAndRefreshTokens";
import { updateAccessAndRefreshTokens_deprecated } from "@src/commands/updateAccessAndRefreshTokens_deprecated";
import { oauth2Client, config } from "@src/config";

export function withAuth(handler: Handler): Handler {
  return async (
    request: ExtendedRequest,
    response: ServerResponse,
  ): Promise<unknown> => {
    const userDocumentId = request.session.get("user-session-id");
    const userSession = request.session.get("user-session");

    const user = await request.mongoDb.collection("users").findOne<MongoUser>({
      _id: new ObjectId(userDocumentId),
    });

    if (userSession && user) {
      try {
        await oauth2Client
          .verifyJWT<{ sub: string }>(
            userSession.access_token,
            config.connectJwtAlgorithm,
          )
          .catch(async (error) => {
            if (error.name === "TokenExpiredError") {
              const { refresh_token, access_token } = await refreshTokensFlow(
                user.refresh_token,
              );

              const { sub } = await oauth2Client.verifyJWT<{
                sub: string;
              }>(userSession.access_token, config.connectJwtAlgorithm);

              await updateAccessAndRefreshTokens(sub, refresh_token);

              await updateAccessAndRefreshTokens_deprecated(
                request.mongoDb,
                userDocumentId,
                access_token,
                refresh_token,
              );
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
