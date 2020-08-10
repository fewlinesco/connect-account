import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "../../@types/ExtendedRequest";
import { withAPIPageLogger } from "../../middleware/withAPIPageLogger";
import withSession from "../../middleware/withSession";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (request.method === "GET") {
    const userId = request.session.get("user-id");
    if (userId) {
      response.json({ userId });
    } else {
      response.writeHead(302, { Location: "/" });
    }
  } else {
    response.statusCode = 405;

    return response.end();
  }
};

export default withAPIPageLogger(withSession(handler));
