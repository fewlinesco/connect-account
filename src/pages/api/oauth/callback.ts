import { HttpStatus } from "@fewlines/fwl-web";
import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "../../../@types/ExtendedRequest";
import { HttpVerbs } from "../../../@types/HttpVerbs";
import { config } from "../../../config";
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
      const protocol =
        process.env.NODE_ENV === "production" ? "https://" : "http://";
      const host = request.headers.host;
      const route = "/api/oauth/callback";
      const redirect_uri = protocol + host + route;

      const callback = {
        client_id: config.connectApplicationClientId,
        client_secret: config.connectApplicationClientSecret,
        code: request.query.code as string,
        grant_type: "authorization_code",
        redirect_uri,
      };

      const fetchedResponse = await fetchJson(
        `${config.connectProviderUrl}/oauth/token`,
        HttpVerbs.POST,
        callback,
      );

      const parsedResponse = await fetchedResponse.json();

      jwt.verify(parsedResponse.access_token, callback.client_secret);

      request.session.set("user-jwt", parsedResponse.access_token);

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
