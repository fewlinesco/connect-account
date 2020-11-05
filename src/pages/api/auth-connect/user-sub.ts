import { HttpStatus } from "@fwl/web";
import type { NextApiResponse } from "next";
import type { Handler } from "next-iron-session";

import type { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withMongoDB } from "@src/middlewares/withMongoDB";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (request.method === "GET") {
    const userSub = request.session.get("user-sub");

    if (userSub) {
      response.json({ userSub });
    } else {
      response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
        Location: "/",
      });
    }
  } else {
    response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

    return response.end();
  }
};

export default wrapMiddlewares(
  [withLogger, withSentry, withMongoDB, withSession, withAuth],
  handler,
);
