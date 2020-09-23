import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { IdentityStatus } from "@lib/@types/Identity";
import { sendIdentityValidationCode } from "@lib/commands/sendIdentityValidationCode";
import { ExtendedRequest } from "@src/@types/ExtendedRequest";
import { insertTemporaryIdentity } from "@src/command/insertTemporaryIdentity";
import { config, oauth2Client } from "@src/config";
import { GraphqlErrors, MongoNoDataReturned } from "@src/errors";
import { withAPIPageLogger } from "@src/middleware/withAPIPageLogger";
import { withMongoDB } from "@src/middleware/withMongoDB";
import withSession from "@src/middleware/withSession";
import { getUser } from "@src/utils/getUser";
import Sentry, { addRequestScopeToSentry } from "@src/utils/sentry";

const handler: Handler = async (request: ExtendedRequest, response) => {
  addRequestScopeToSentry(request);

  try {
    if (request.method === "POST") {
      const { callbackUrl, identityInput } = request.body;

      const user = await getUser(request.headers["cookie"] as string);

      if (user) {
        const decoded = await oauth2Client.verifyJWT<{ sub: string }>(
          user.accessToken,
          config.connectJwtAlgorithm,
        );

        const identity = {
          status: IdentityStatus.VALIDATED,
          type: identityInput.type.toUpperCase(),
          value: identityInput.value,
        };

        return sendIdentityValidationCode({
          callbackUrl,
          identity,
          localeCodeOverride: "en-EN",
          userId: decoded.sub,
        })
          .then(async ({ errors, data }) => {
            if (errors) {
              throw new GraphqlErrors(errors);
            }

            if (data) {
              const temporaryIdentity = {
                eventId: data.sendIdentityValidationCode.eventId,
                value: identityInput.value,
                type: identityInput.type,
                expiresAt: identityInput.expiresAt,
              };

              await insertTemporaryIdentity(
                decoded.sub,
                temporaryIdentity,
                request.mongoDb,
              );

              return data.sendIdentityValidationCode.eventId;
            } else {
              throw new MongoNoDataReturned();
            }
          })
          .then((data) => {
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
