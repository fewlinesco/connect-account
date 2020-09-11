import { HttpStatus } from "@fwl/web";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "../../@types/ExtendedRequest";
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
      const userSub = request.session.get("user-sub");

      if (userSub) {
        response.json({ userSub });
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
      scope.setTag("api/user-sub", "api/user-sub");
      Sentry.captureException(error);
    });

    return response.end();
  }
};

export default withAPIPageLogger(withSession(handler));
