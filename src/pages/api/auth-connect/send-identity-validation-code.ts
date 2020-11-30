import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { sendIdentityValidationCode } from "@lib/commands/sendIdentityValidationCode";
import { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { insertTemporaryIdentity } from "@src/commands/insertTemporaryIdentity";
import { GraphqlErrors, MongoNoDataReturned } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { getUser } from "@src/utils/getUser";

const handler: Handler = async (request: ExtendedRequest, response) => {
  if (request.method === "POST") {
    const { callbackUrl, identityInput } = request.body;

    const user = await getUser(request.headers["cookie"] as string);

    if (user) {
      const identity = {
        type: identityInput.type.toUpperCase(),
        value: identityInput.value,
      };

      return sendIdentityValidationCode({
        callbackUrl,
        identity,
        localeCodeOverride: "en-EN",
        userId: user.sub,
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
              user.sub,
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
    }
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares(
  [withLogger, withSentry, withSession, withAuth],
  handler,
);
