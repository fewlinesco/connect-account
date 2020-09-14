import { HttpStatus } from "@fwl/web";

import { Handler } from "../../../@types/ApiPageHandler";
import { findOrInsertUser } from "../../../command/mongo/findOrInsertUser";
import { withAPIPageLogger } from "../../../middleware/withAPIPageLogger";
import { withMongoDB } from "../../../middleware/withMongoDB";
import Sentry, { addRequestScopeToSentry } from "../../../utils/sentry";

const handler: Handler = async (request, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { sub, accessToken, refreshToken } = request.body;

      return findOrInsertUser(
        { sub, accessToken, refreshToken },
        request.mongoDb,
      ).then((data) => {
        response.statusCode = HttpStatus.OK;

        response.setHeader("Content-Type", "application/json");
        response.json({ data });
      });
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag(
        "api/auth-connect/find-or-insert-mongo-user",
        "api/auth-connect/find-or-insert-mongo-user",
      );
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(withMongoDB(handler));
