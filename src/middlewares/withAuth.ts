import { HttpStatus } from "@fwl/web";
import { ServerResponse } from "http";
import { ObjectId } from "mongodb";

import type { MongoUser } from "@lib/@types/mongo/User";
import { refreshTokensFlow } from "@lib/commands/refreshTokensFlow";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { Handler } from "@src/@types/Handler";
import { updateAccessAndRefreshTokens } from "@src/commands/updateAccessAndRefreshTokens";
import { oauth2Client, config } from "@src/config";

export function withAuth(handler: Handler): Handler {
  return async (
    request: ExtendedRequest,
    response: ServerResponse,
  ): Promise<unknown> => {
    const userDocumentId = request.session.get("user-session-id");

    console.log("withAuth document id", userDocumentId);

    const user = await request.mongoDb.collection("users").findOne<MongoUser>({
      _id: new ObjectId(userDocumentId),
    });

    console.log("withAuth user", user);

    if (user) {
      try {
        await oauth2Client
          .verifyJWT<{ sub: string }>(
            user.accessToken,
            config.connectJwtAlgorithm,
          )
          .catch(async (error) => {
            if (error.name === "TokenExpiredError") {
              const { refresh_token, access_token } = await refreshTokensFlow(
                user.refreshToken,
              );

              await updateAccessAndRefreshTokens(
                request.mongoDb,
                userDocumentId,
                access_token,
                refresh_token,
              );

              await oauth2Client.verifyJWT(
                access_token,
                config.connectJwtAlgorithm,
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
