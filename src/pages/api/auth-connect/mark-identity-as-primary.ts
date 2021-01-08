import { HttpStatus } from "@fwl/web";

import { markIdentityAsPrimary } from "@lib/commands/mark-identity-as-primary";
import { Handler } from "@src/@types/core/Handler";
import { UserCookie } from "@src/@types/user-cookie";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { isMarkingIdentityAsPrimaryAuthorized } from "@src/utils/isMarkingIdentityAsPrimaryAuthorized";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";
import { getServerSideCookies } from "@src/utils/serverSideCookies";

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
          return markIdentityAsPrimary(identityId).then((data) => {
            response.statusCode = HttpStatus.OK;
            response.setHeader("Content-type", "application/json");
            response.json({ data });
          });
        }

        response.statusCode = HttpStatus.BAD_REQUEST;
        return response.end();
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
