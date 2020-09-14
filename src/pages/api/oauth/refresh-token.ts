import { HttpStatus } from "@fwl/web";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "../../../@types/ExtendedRequest";
import { config } from "../../../config";
import { withAPIPageLogger } from "../../../middleware/withAPIPageLogger";
import withSession from "../../../middleware/withSession";
import { refreshTokenFlow } from "../../../utils/refreshTokenFlow";
import Sentry, { addRequestScopeToSentry } from "../../../utils/sentry";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { refreshToken, redirectUrl, userDocumentId } = request.body;

      if (userDocumentId && refreshToken) {
        await refreshTokenFlow(refreshToken);

        response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
          Location: `${config.connectDomain}/${redirectUrl}`,
        });

        response.end();
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
      scope.setTag("api/oauth/callback", "api/oauth/callback");
      Sentry.captureException(error);
    });
  }
};

export default withAPIPageLogger(withSession(handler));
