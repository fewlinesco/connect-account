import { withAPIPageLogger } from "src/middleware/withAPIPageLogger";

import { Handler } from "../../@types/ApiPageHandler";
import { addIdentityToUser } from "../../command/addIdentityToUser";
import { removeIdentityFromUser } from "../../command/removeIdentityFromUser";

const handler: Handler = async (request) => {
  const { userId, type, value } = request.body;

  if (request.method === "POST") {
    return addIdentityToUser({ userId, type, value }).then((data) => {
      return { status: 201, data };
    });
  } else if (request.method === "DELETE") {
    return removeIdentityFromUser({ userId, type, value }).then((data) => {
      return { status: 20, data };
    });
  }

  return Promise.reject();
};

export default withAPIPageLogger(handler);
