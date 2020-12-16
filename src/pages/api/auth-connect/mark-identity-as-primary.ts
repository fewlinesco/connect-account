import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { markIdentityAsPrimary } from "@lib/commands/markIdentityAsPrimary";
import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { isMarkingIdentityAsPrimaryAuthorized } from "@src/utils/isMarkingIdentityAsPrimaryAuthorized";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request: ExtendedRequest, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { identityId } = request.body;

      const userCookie = request.session.get<UserCookie>(
        "user-cookie",
      ) as UserCookie;

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

export default wrapMiddlewares(
  [withLogger, withSentry, withSession, withAuth],
  handler,
);
