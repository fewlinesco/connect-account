import { HttpStatus } from "@fwl/web";
import { ServerResponse } from "http";

import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { Handler } from "@src/@types/core/Handler";
import { handleAuthErrors } from "@src/handlers/handleAuthErrors";
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
      const { access_token: currentAccessToken, sub } = userSession;

      try {
        await decryptVerifyAccessToken(currentAccessToken);

        return handler(request, response);
      } catch (error) {
        return handleAuthErrors(request, response, error, sub);
      }
    } else {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
  };
}
