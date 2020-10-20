import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { createOrUpdatePassword } from "@lib/commands/createOrUpdatePassword";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { config, oauth2Client } from "@src/config";
import { withAPIPageLogger } from "@src/middleware/withAPIPageLogger";
import { withMongoDB } from "@src/middleware/withMongoDB";
import withSession from "@src/middleware/withSession";
import { getUser } from "@src/utils/getUser";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request: ExtendedRequest, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { passwordInput } = request.body;

      const user = await getUser(request.headers["cookie"] as string);

      if (user) {
        const decoded = await oauth2Client.verifyJWT<{ sub: string }>(
          user.accessToken,
          config.connectJwtAlgorithm,
        );

        return createOrUpdatePassword({
          cleartextPassword: passwordInput,
          userId: decoded.sub,
        }).then((data) => {
          response.statusCode = HttpStatus.OK;
          response.setHeader("Content-Type", "application/json");
          response.json({ data });
        });
      } else {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", request.headers.referer || "/");
        response.end();
      }
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setTag(
        "send-identity-validation-code",
        "send-identity-validation-code",
      );
      Sentry.captureException(error);
    });
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default withAPIPageLogger(withSession(withMongoDB(handler)));
