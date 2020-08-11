import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";
import { promisifiedJWTVerify } from "src/utils/promisifiedJWTVerify";

import { ExtendedRequest } from "../../@types/ExtendedRequest";
import { config } from "../../config";
import { withAPIPageLogger } from "../../middleware/withAPIPageLogger";
import withSession from "../../middleware/withSession";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (request.method === "GET") {
    const accessToken = request.session.get("user-jwt");

    const decoded = await promisifiedJWTVerify<{ sub: string }>({
      clientSecret: config.connectApplicationClientSecret,
      accessToken,
    });

    if (decoded) {
      response.json({ userId: decoded.sub });
    } else {
      response.writeHead(302, { Location: request.headers.referer || "/" });
    }
  } else {
    response.statusCode = 405;

    return response.end();
  }
};

export default withAPIPageLogger(withSession(handler));
