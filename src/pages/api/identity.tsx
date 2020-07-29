import { FetchResult } from "apollo-link";
import { NextApiRequest, NextApiResponse } from "next";
import { withAPIPageLogger } from "src/middleware/withAPIPageLogger";

import { addIdentityToUser } from "../../command/addIdentityToUser";
import { removeIdentityFromUser } from "../../command/removeIdentityFromUser";

export type Handler = (
  request: NextApiRequest,
  response: NextApiResponse,
) => Promise<FetchResult | Error>;

const handler: Handler = (request, _response) => {
  const { userId, type, value } = request.body;

  if (request.method === "POST") {
    return addIdentityToUser({ userId, type, value });
  } else if (request.method === "DELETE") {
    return removeIdentityFromUser({ userId, type, value });
  }

  return Promise.reject();
};

export default withAPIPageLogger(handler);
