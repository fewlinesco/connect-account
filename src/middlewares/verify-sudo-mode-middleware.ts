import { Tracer } from "@fwl/tracing";
import { Middleware } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { getUserFromCookie } from "@src/workflows/get-db-user-from-user-cookie";

function verifySudoModeMiddleware(
  tracer: Tracer,
  urlBeforeRedirect: string,
): Middleware<NextApiRequest, NextApiResponse> {
  return (handler) => {
    return async (
      request: NextApiRequest,
      response: NextApiResponse,
    ): Promise<void> => {
      return tracer.span("verify-sudo-mode-middleware", async () => {
        const {
          sudo: { sudo_mode_ttl: sudoModeTTL },
        } = await getUserFromCookie(tracer, request);

        return !sudoModeTTL || Date.now() > sudoModeTTL
          ? {
              redirect: {
                destination: `/account/security/sudo?next=${urlBeforeRedirect}`,
                permanent: false,
              },
            }
          : handler(request, response);
      });
    };
  };
}

export { verifySudoModeMiddleware };
