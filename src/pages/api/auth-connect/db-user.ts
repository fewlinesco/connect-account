import { HttpStatus } from "@fwl/web";

import { Handler } from "../../../@types/ApiPageHandler";
import { findOrInsertUser } from "../../../command/mongo/findOrInsertUser";
import { withAPIPageLogger } from "../../../middleware/withAPIPageLogger";
import Sentry, { addRequestScopeToSentry } from "../../../utils/sentry";

const handler: Handler = async (request, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { sub, accessToken, refreshToken } = request.body;

      return findOrInsertUser({ sub, accessToken, refreshToken }).then(
        (data) => {
          response.statusCode = HttpStatus.OK;

          response.setHeader("Content-Type", "application/json");

          response.json({ data });
        },
      );
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("api/auth-connect/db-user", "api/auth-connect/db-user");
      Sentry.captureException(error);
    });
    console.log(error);
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(handler);
