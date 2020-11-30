import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { sendIdentityValidationCode } from "@lib/commands/sendIdentityValidationCode";
import { UserCookie } from "@src/@types/UserCookie";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { insertTemporaryIdentity } from "@src/commands/insertTemporaryIdentity";
import { GraphqlErrors } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";

const handler: Handler = async (request: ExtendedRequest, response) => {
  if (request.method === "POST") {
    const { callbackUrl, identityInput } = request.body;

    const userSession = request.session.get<UserCookie>("user-session");

    if (userSession) {
      const identity = {
        type: identityInput.type.toUpperCase(),
        value: identityInput.value,
      };

      return sendIdentityValidationCode({
        callbackUrl,
        identity,
        localeCodeOverride: "en-EN",
        userId: userSession.sub,
      })
        .then(async ({ errors, data }) => {
          if (errors) {
            throw new GraphqlErrors(errors);
          }

          if (!data) {
            throw new Error("Management query failed");
          }

          const temporaryIdentity = {
            eventId: data.sendIdentityValidationCode.eventId,
            value: identityInput.value,
            type: identityInput.type,
            expiresAt: identityInput.expiresAt,
          };

          await insertTemporaryIdentity(userSession.sub, temporaryIdentity);

          return data.sendIdentityValidationCode.eventId;
        })
        .then((data) => {
          response.statusCode = HttpStatus.OK;
          response.setHeader("Content-Type", "application/json");
          response.json({ data });
        });
    }
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares(
  [withLogger, withSentry, withSession, withAuth],
  handler,
);
