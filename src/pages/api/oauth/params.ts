import { HttpStatus } from "@fewlines/fwl-web";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "../../../@types/ExtendedRequest";
import { config } from "../../../config";
import { withAPIPageLogger } from "../../../middleware/withAPIPageLogger";
import withSession from "../../../middleware/withSession";
import Sentry, { addRequestScopeToSentry } from "../../../utils/sentry";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "GET") {
      const protocol =
        process.env.NODE_ENV === "production" ? "https://" : "http://";
      const host = request.headers.host;
      const route = "/api/oauth/callback";
      const redirect_uri = protocol + host + route;

      const authorizeURL = new URL(
        "/oauth/authorize",
        config.connectProviderUrl,
      );
      authorizeURL.searchParams.append(
        "client_id",
        config.connectApplicationClientId,
      );
      authorizeURL.searchParams.append("response_type", "code");
      authorizeURL.searchParams.append("redirect_uri", redirect_uri);
      authorizeURL.searchParams.append(
        "scope",
        config.connectApplicationScopes,
      );

      response.json({ authorizeURL });
    } else {
      response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

      return response.end();
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("api/oauth/params", "api/oauth/params");
      Sentry.captureException(error);
    });

    return response.end();
  }
};

export default withAPIPageLogger(withSession(handler));
