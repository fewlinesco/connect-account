import { markIdentityAsPrimary } from "@fewlines/connect-management";
import { HttpStatus } from "@fwl/web";

import { Handler } from "@src/@types/core/Handler";
import { UserCookie } from "@src/@types/user-cookie";
import { config } from "@src/config";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { isMarkingIdentityAsPrimaryAuthorized } from "@src/utils/is-marking-identity-as-primary-authorized";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

const handler: Handler = async (request, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { identityId } = request.body;

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
      });

      if (userCookie) {
        const isAuthorized = await isMarkingIdentityAsPrimaryAuthorized(
          userCookie.sub,
          identityId,
        );

        if (isAuthorized) {
          return markIdentityAsPrimary(
            config.managementCredentials,
            identityId,
          ).then(() => {
            response.statusCode = HttpStatus.OK;
            response.setHeader("Content-type", "application/json");
            response.end();
            return;
          });
        }

        response.statusCode = HttpStatus.BAD_REQUEST;
        response.end();
        return;
      } else {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        response.end();
        return;
      }
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag("mark-identity-as-primary", "mark-identity-as-primary");
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  // TODO: better deal with this error
  return Promise.reject(new Error("Method not allowed"));
};

export default wrapMiddlewares([withLogger, withSentry, withAuth], handler);
