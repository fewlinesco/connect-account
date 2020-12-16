import { HttpStatus } from "@fwl/web";
import { NextApiResponse } from "next";
import { Handler } from "next-iron-session";

import type { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { getAndPutUser } from "@src/commands/getAndPutUser";
import { oauth2Client } from "@src/config";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { decryptVerifyAccessToken } from "@src/workflows/decryptVerifyAccessToken";

const handler: Handler = async (
  request: ExtendedRequest,
  response: NextApiResponse,
): Promise<void> => {
  if (request.method === "GET") {
    const {
      access_token,
      refresh_token,
    } = await oauth2Client.getTokensFromAuthorizationCode(
      `${request.query.code}`,
    );

    const decodedAccessToken = await decryptVerifyAccessToken(access_token);

    const oAuth2UserInfo = {
      sub: decodedAccessToken.sub,
      refresh_token,
    };

    await getAndPutUser(oAuth2UserInfo);

    request.session.set("user-cookie", {
      access_token,
      sub: decodedAccessToken.sub,
    });

    await request.session.save();

    response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
      Location: "/account",
    });

    response.end();
  } else {
    response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

    return response.end();
  }
};

export default wrapMiddlewares([withLogger, withSentry, withSession], handler);
