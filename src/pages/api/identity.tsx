import { HttpStatus } from "@fewlines/fwl-web";

import { Handler } from "../../@types/ApiPageHandler";
import { addIdentityToUser } from "../../command/addIdentityToUser";
import { removeIdentityFromUser } from "../../command/removeIdentityFromUser";
import { withAPIPageLogger } from "../../middleware/withAPIPageLogger";

const handler: Handler = async (request) => {
  const { userId, type, value } = request.body;

  if (request.method === "POST") {
    return addIdentityToUser({ userId, type, value }).then((data) => {
      return { status: HttpStatus.CREATED, data };
    });
  } else if (request.method === "DELETE") {
    return removeIdentityFromUser({ userId, type, value }).then((data) => {
      return { status: HttpStatus.ACCEPTED, data };
    });
  }

  return Promise.reject();
};

export default withAPIPageLogger(handler);
