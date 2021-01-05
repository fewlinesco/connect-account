import { HttpStatus } from "@fwl/web";

import { removeIdentityFromUser } from "@lib/commands/removeIdentityFromUser";
import { Handler } from "@src/@types/core/Handler";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";

const handler: Handler = async (request, response) => {
  const { userId, type, value } = request.body;

  if (request.method === "DELETE") {
    return removeIdentityFromUser({ userId, type, value }).then((data) => {
      response.statusCode = HttpStatus.ACCEPTED;

      response.setHeader("Content-Type", "application/json");

      response.end(JSON.stringify({ data }));
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;
  response.end();

  return Promise.reject();
};

export default wrapMiddlewares([withLogger, withSentry, withAuth], handler);
