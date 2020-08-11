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

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (request.method === "GET") {
    const callback = {
      client_id: config.connectApplicationClientId,
      client_secret: config.connectApplicationClientSecret,
      code: request.query.code as string,
      grant_type: "authorization_code",
      redirect_uri: config.connectApplicationRedirectUri,
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

    response.writeHead(HttpStatus.MOVED_TEMPORARILY, {
      Location: "/account",
    });

    response.end();
  } else {
    response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

    return response.end();
  }
};

export default withAPIPageLogger(withSession(handler));
