import { HttpStatus } from "@fwl/web";
import { sendIdentityValidationCode } from "@lib/sendIdentityValidationCode";
import { Handler } from "next-iron-session";

import { ExtendedRequest } from "../../../@types/ExtendedRequest";
import { config, oauth2Client } from "../../../config";
import { withAPIPageLogger } from "../../../middleware/withAPIPageLogger";
import Sentry, { addRequestScopeToSentry } from "../../../utils/sentry";

const handler: Handler = async (request: ExtendedRequest, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { callbackUrl, type, value } = request.body;

      const accessToken = request.session.get("user-jwt");

      const decoded = await oauth2Client.verifyJWT<{ sub: string }>(
        accessToken,
        config.connectJwtAlgorithm,
      );

      const identity = {
        userId: decoded.sub,
        type,
        value,
      };

      return sendIdentityValidationCode({
        callbackUrl,
        identity,
        userId: decoded.sub,
      }).then((data) => {
        response.statusCode = HttpStatus.OK;

        response.setHeader("Content-Type", "application/json");

        response.json({ data });
      });
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

export default withAPIPageLogger(handler);
