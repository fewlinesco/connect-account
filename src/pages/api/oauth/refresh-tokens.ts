import { HttpStatus } from "@fwl/web";
import type { NextApiResponse } from "next";
import type { Handler } from "next-iron-session";

import { refreshTokensFlow } from "@lib/refreshTokensFlow";
import type { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { config } from "@src/config";
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
    if (request.method === "POST") {
      const { refreshToken, redirectUrl, userDocumentId } = request.body;

      if (userDocumentId && refreshToken) {
        await refreshTokensFlow(refreshToken, request.mongoDb, userDocumentId);

        response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
          Location: `${config.connectDomain}/${redirectUrl}`,
        });

        response.end();
      } else {
        response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
          Location: request.headers.referer || "/",
        });

        response.end();
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

export default withAPIPageLogger(withSession(withMongoDB(handler)));
