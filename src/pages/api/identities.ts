import { HttpStatus } from "@fwl/web";

import { removeIdentityFromUser } from "@lib/commands/removeIdentityFromUser";
import { Handler } from "@src/@types/ApiPageHandler";
import { addIdentityToUser } from "@src/commands/addIdentityToUser";
import { withAPIPageLogger } from "@src/middlewares/withAPIPageLogger";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request, response) => {
  addRequestScopeToSentry(request);

  try {
    const { userId, type, value } = request.body;

    if (request.method === "POST") {
      return addIdentityToUser({ userId, type, value }).then((data) => {
        response.statusCode = HttpStatus.OK;

        response.setHeader("Content-Type", "application/json");

        response.json({ data });
      });
    } else if (request.method === "DELETE") {
      return removeIdentityFromUser({ userId, type, value }).then((data) => {
        response.statusCode = HttpStatus.ACCEPTED;

        response.setHeader("Content-Type", "application/json");

        response.json({ data });
      });
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("api/identities", "api/identities");
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(handler);
