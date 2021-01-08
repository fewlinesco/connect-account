import { HttpStatus } from "@fwl/web";

import { Handler } from "@src/@types/core/Handler";
import { getAndPutUser } from "@src/commands/get-and-put-user";
import { oauth2Client } from "@src/config";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { setServerSideCookies } from "@src/utils/serverSideCookies";
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

    await setServerSideCookies(
      response,
      "user-cookie",
      {
        access_token,
        sub: decodedAccessToken.sub,
      },
      {
        shouldCookieBeSealed: true,
        maxAge: 24 * 60 * 60,
        path: "/",
        httpOnly: true,
        secure: true,
      },
    );

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
