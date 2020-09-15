import { HttpStatus } from "@fwl/web";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "../../../@types/ExtendedRequest";
import { HttpVerbs } from "../../../@types/HttpVerbs";
import { AccessToken } from "../../../@types/oauth2/OAuth2Tokens";
import { oauth2Client, config } from "../../../config";
import { withAPIPageLogger } from "../../../middleware/withAPIPageLogger";
import withSession from "../../../middleware/withSession";
import { fetchJson } from "../../../utils/fetchJson";
import Sentry, { addRequestScopeToSentry } from "../../../utils/sentry";

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

      const route = "/api/auth-connect/find-or-insert-user";
      const absoluteURL = config.connectDomain + route;

      const jsonResponse = await fetchJson(absoluteURL, HttpVerbs.POST, {
        sub: decodedAccessToken.sub,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      }).then((response) => response.json());

      request.session.set("user-session-id", jsonResponse.data.documentId);
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

export default withAPIPageLogger(withSession(handler));
