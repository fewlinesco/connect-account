import { HttpStatus } from "@fwl/web";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import type { ExtendedRequest } from "@src/@types/ExtendedRequest";
import type { AccessToken } from "@src/@types/oauth2/OAuth2Tokens";
import { findOrInsertUser_deprecated } from "@src/commands/findOrInsertUser_deprecated";
import { getAndPutUser } from "@src/commands/getAndPutUser";
import { oauth2Client, config } from "@src/config";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (request.method === "GET") {
    const {
      access_token,
      refresh_token,
      id_token,
    } = await oauth2Client.getTokensFromAuthorizationCode(
      request.query.code as string,
    );

    const decodedAccessToken = await oauth2Client.verifyJWT<AccessToken>(
      access_token,
      config.connectJwtAlgorithm,
    );

    const oauthUserInfo_deprecated = {
      sub: decodedAccessToken.sub,
      accessToken: access_token,
      refresh_token,
      id_token,
    };

    const documentId = await findOrInsertUser_deprecated(
      oauthUserInfo_deprecated,
      request.mongoDb,
    );

    const oAuth2UserInfo = {
      sub: decodedAccessToken.sub,
      refresh_token,
      id_token,
    };

    await getAndPutUser(oAuth2UserInfo);

    request.session.set("user-session-id", documentId);
    request.session.set("user-sub", decodedAccessToken.sub);
    request.session.set("user-session", { access_token });

    await request.session.save();

    response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
      Location: "/account",
    });

    response.end();
  } else {
    response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

    return response.end();
  }
};

export default wrapMiddlewares(
  [withLogger, withSentry, withMongoDB, withSession],
  handler,
);
