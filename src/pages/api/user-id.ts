import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";
import { ExtendedRequest } from "src/@types/ExtendedRequest";
import withSession from "src/middleware/withSession";

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

export default withSession(handler);
