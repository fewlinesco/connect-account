import { HttpStatus } from "@fewlines/fwl-web";

import { Handler } from "../../@types/ApiPageHandler";
import { addIdentityToUser } from "../../command/addIdentityToUser";
import { removeIdentityFromUser } from "../../command/removeIdentityFromUser";
import { withAPIPageLogger } from "../../middleware/withAPIPageLogger";
import Sentry, { configureReq } from "../../utils/sentry";

const handler: Handler = async (request, response) => {
  configureReq(request);

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
      scope.setTag("api/account", "api/account");
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(handler);
