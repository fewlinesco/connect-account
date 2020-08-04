import { HttpStatus } from "@fewlines/fwl-web";

import { Handler } from "../../@types/ApiPageHandler";
import { addIdentityToUser } from "../../command/addIdentityToUser";
import { removeIdentityFromUser } from "../../command/removeIdentityFromUser";
import { withAPIPageLogger } from "../../middleware/withAPIPageLogger";

const handler: Handler = async (request, response) => {
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

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(handler);
