import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { markIdentityAsPrimary } from "@lib/commands/markIdentityAsPrimary";
import { withAPIPageLogger } from "@src/middlewares/withAPIPageLogger";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { identityId } = request.body;

      return markIdentityAsPrimary(identityId).then((data) => {
        response.statusCode = HttpStatus.OK;

        response.setHeader("Content-type", "application/json");

        response.json({ data });
      });
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("mark-identity-as-primary", "mark-identity-as-primary");
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(handler);
