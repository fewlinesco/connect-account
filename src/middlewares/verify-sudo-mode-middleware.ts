import { Tracer } from "@fwl/tracing";
import { getServerSideCookies } from "@fwl/web";
import { Middleware } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { UserCookie } from "@src/@types/user-cookie";
import { configVariables } from "@src/configs/config-variables";
import { NoUserCookieFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";

function verifySudoMode(
  tracer: Tracer,
  urlBeforeRedirect: string,
): Middleware<NextApiRequest, NextApiResponse> {
  return (handler) => {
    return async (
      request: NextApiRequest,
      response: NextApiResponse,
    ): Promise<void> => {
      return tracer.span("verify-sudo-mode-middleware", async () => {
        const webErrors = {
          databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
          noUserFound: ERRORS_DATA.NO_USER_FOUND,
          sudoModeTTLNotFound: ERRORS_DATA.SUDO_MODE_TTL_NOT_FOUND,
        };

        const userCookie = await getServerSideCookies<UserCookie>(request, {
          cookieName: "user-cookie",
          isCookieSealed: true,
          cookieSalt: configVariables.cookieSalt,
        });

        if (!userCookie) {
          throw new NoUserCookieFoundError();
        }

        const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
          throw webErrorFactory({
            ...webErrors.databaseUnreachable,
            parentError: error,
          });
        });

        if (!user) {
          throw webErrorFactory(webErrors.noUserFound);
        }

        const sudoModeTTL = user.sudo.sudo_mode_ttl;

        if (!sudoModeTTL || Date.now() > sudoModeTTL) {
          return {
            redirect: {
              destination: `/account/security/sudo?next=${urlBeforeRedirect}`,
              permanent: false,
            },
          };
        } else {
          return handler(request, response);
        }
      });
    };
  };
}

export { verifySudoMode };
