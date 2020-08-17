import { HttpStatus } from "@fewlines/fwl-web";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";
import { promisifiedJWTVerify } from "src/utils/promisifiedJWTVerify";

import { ExtendedRequest } from "../../@types/ExtendedRequest";
import { config } from "../../config";
import { withAPIPageLogger } from "../../middleware/withAPIPageLogger";
import withSession from "../../middleware/withSession";
import Sentry, { addRequestScopeToSentry } from "../../utils/sentry";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "GET") {
      const accessToken = request.session.get("user-jwt");

      const decoded = await promisifiedJWTVerify<{ sub: string }>(
        config.connectApplicationClientSecret,
        accessToken,
      );

      if (decoded) {
        response.json({ userId: decoded.sub });
      } else {
        response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
          Location: request.headers.referer || "/",
        });
      }
    } else {
      response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

      return response.end();
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("api/user-id", "api/user-id");
      Sentry.captureException(error);
    });

    return response.end();
  }
};

export default withAPIPageLogger(withSession(handler));
