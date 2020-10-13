import { HttpStatus } from "@fwl/web";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import type { ExtendedRequest } from "@src/@types/ExtendedRequest";
import type { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { findOrInsertUser } from "@src/command/findOrInsertUser";
import { oauth2Client, config } from "@src/config";
import { withAPIPageLogger } from "@src/middleware/withAPIPageLogger";
import { withMongoDB } from "@src/middleware/withMongoDB";
import withSession from "@src/middleware/withSession";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "GET") {
      const tokens = await oauth2Client.getTokensFromAuthorizationCode(
        request.query.code as string,
      );

      const decodedAccessToken = await oauth2Client.verifyJWT<AccessToken>(
        tokens.access_token,
        config.connectJwtAlgorithm,
      );

      const oauthUserInfo = {
        sub: decodedAccessToken.sub,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };

      const documentId = await findOrInsertUser(oauthUserInfo, request.mongoDb);
      console.log({ documentId });
      request.session.set("user-session-id", documentId);
      request.session.set("user-sub", decodedAccessToken.sub);

      await request.session.save();

      response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
        Location: "/account",
      });

      response.end();
    } else {
      response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

      return response.end();
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("api/oauth/callback", "api/oauth/callback");
      Sentry.captureException(error);
    });
  }
};

export default withAPIPageLogger(withSession(withMongoDB(handler)));
