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
import { getIdentityType } from "@src/utils/getIdentityType";

const handler: Handler = async (request: ExtendedRequest, response) => {
  if (request.method === "POST") {
    const { callbackUrl, identityInput } = request.body;

    const userCookie = request.session.get<UserCookie>("user-cookie");

    if (userCookie) {
      const identity = {
        type: getIdentityType(identityInput.type),
        value: identityInput.value,
      };

      const { data, errors } = await sendIdentityValidationCode({
        callbackUrl,
        identity,
        localeCodeOverride: "en-EN",
        userId: userCookie.sub,
      });

      if (errors) {
        if ((errors[0] as any).code === "identity_already_validated") {
          response.statusCode = HttpStatus.BAD_REQUEST;
          response.json({ error: (errors[0] as any).code });
          return;
        }

        if ((errors[0] as any).errors.identity_value === "can't be blank") {
          response.statusCode = HttpStatus.BAD_REQUEST;
          response.json({ error: (errors[0] as any).errors.identity_value });
          return;
        }

        throw new GraphqlErrors(errors);
      } else if (!data) {
        throw new Error("Management query failed");
      } else {
        const temporaryIdentity = {
          eventId: data.sendIdentityValidationCode.eventId,
          value: identityInput.value,
          type: identityInput.type,
          expiresAt: identityInput.expiresAt,
          primary: identityInput.primary,
        };

        await insertTemporaryIdentity(userCookie.sub, temporaryIdentity);

        response.statusCode = HttpStatus.OK;
        response.setHeader("Content-Type", "application/json");
        response.json({ data: data.sendIdentityValidationCode.eventId });
        return;
      }
    }

    response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
    response.setHeader("location", "/");
    response.end();
    return;
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;
  return Promise.reject();
};

export default wrapMiddlewares(
  [withLogger, withSentry, withSession, withAuth],
  handler,
);
