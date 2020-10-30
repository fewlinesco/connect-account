import { HttpStatus } from "@fwl/web";
import type { NextApiResponse } from "next";
import type { Handler } from "next-iron-session";

import type { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { withAPIPageLogger } from "@src/middlewares/withAPIPageLogger";
import withSession from "@src/middlewares/withSession";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "GET") {
      const userDocumentId = request.session.get("user-session-id");

      if (userDocumentId) {
        response.json({ userDocumentId });
      } else {
        response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
          Location: request.headers.referer || "/",
        });

        return response.end();
      }
    } else {
      response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

      return response.end();
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag(
        "api/auth-connect/user-document-id",
        "api/auth-connect/user-document-id",
      );
      Sentry.captureException(error);
    });

    return response.end();
  }
};

export default withAPIPageLogger(withSession(handler));
