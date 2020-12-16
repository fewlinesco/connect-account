import { HttpStatus } from "@fwl/web";
import type { NextApiResponse } from "next";
import type { Handler } from "next-iron-session";

import { UserCookie } from "@src/@types/UserCookie";
import type { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (request.method === "GET") {
    const userSession = request.session.get<UserCookie>("user-cookie");

    if (userSession) {
      response.json({ userSub: userSession.sub });
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
  [withLogger, withSentry, withSession, withAuth],
  handler,
);
