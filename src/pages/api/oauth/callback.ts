import { HttpStatus } from "@fwl/web";

import { Handler } from "@src/@types/core/Handler";
import { getAndPutUser } from "@src/commands/getAndPutUser";
import { oauth2Client } from "@src/config";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { decryptVerifyAccessToken } from "@src/workflows/decryptVerifyAccessToken";

const handler: Handler = async (request, response): Promise<void> => {
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

    response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
      Location: "/account",
    });

    response.end();
    return;
  } else {
    response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

    response.end();
    return;
  }
};

export default wrapMiddlewares([withLogger, withSentry], handler);
