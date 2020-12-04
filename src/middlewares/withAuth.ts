import { HttpStatus } from "@fwl/web";
import { ServerResponse } from "http";

import { refreshTokensFlow } from "@lib/commands/refreshTokensFlow";
import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import { getAndPutUser } from "@src/commands/getAndPutUser";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";
import { decryptVerifyAccessToken } from "@src/workflows/decryptVerifyAccessToken";

export function withAuth(handler: Handler): Handler {
  return async (
    request: ExtendedRequest,
    response: ServerResponse,
  ): Promise<unknown> => {
    const userSession = request.session.get<UserCookie | undefined>(
      "user-session",
    );

    if (userSession) {
      try {
        const { access_token: currentAccessToken, sub } = userSession;

        await decryptVerifyAccessToken(currentAccessToken).catch(
          async (error) => {
            if (error.name === "TokenExpiredError") {
              const user = await getDBUserFromSub(sub);

              if (user) {
                const { refresh_token, access_token } = await refreshTokensFlow(
                  user.refresh_token,
                );

                const { sub } = await decryptVerifyAccessToken(access_token);

                request.session.set<UserCookie>("user-session", {
                  access_token,
                  sub,
                });

                await getAndPutUser({ sub, refresh_token }, user);
              } else {
                throw new Error("No user found");
              }
            } else {
              throw error;
            }
          },
        );

        return handler(request, response);
      } catch (error) {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        response.end();
        return;
      }
    } else {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
  };
}
