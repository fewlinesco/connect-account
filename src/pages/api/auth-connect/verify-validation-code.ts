import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { checkVerificationCode } from "@lib/queries/checkVerificationCode";
import { UserCookie } from "@src/@types/UserCookie";
import type { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import { addIdentityToUser } from "@src/commands/addIdentityToUser";
import { TemporaryIdentityExpired } from "@src/errors";
import { withAuth } from "@src/middlewares/withAuth";
import { withLogger } from "@src/middlewares/withLogger";
import { withSentry } from "@src/middlewares/withSentry";
import { withSession } from "@src/middlewares/withSession";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { getDBUserFromSub } from "@src/queries/getDBUserFromSub";
import { getIdentityType } from "@src/utils/getIdentityType";

const handler: Handler = async (request: ExtendedRequest, response) => {
  if (request.method === "POST") {
    const { validationCode, eventId } = request.body;

    const userSession = request.session.get<UserCookie>(
      "user-session",
    ) as UserCookie;

    const user = await getDBUserFromSub(userSession.sub);

    if (user) {
      const temporaryIdentity = user.temporary_identities.find(
        (temporaryIdentity) => temporaryIdentity.eventId === eventId,
      );

      if (temporaryIdentity && temporaryIdentity.expiresAt < Date.now()) {
        const { data } = await checkVerificationCode(validationCode, eventId);

        const { value, type } = temporaryIdentity;

        if (data && data.checkVerificationCode.status === "VALID") {
          const body = {
            userId: userSession.sub,
            type: getIdentityType(type),
            value,
          };

          await addIdentityToUser(body);

          response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
            Location: "/account/logins",
          });

          return response.end();
        } else {
          response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
            Location: `/account/logins/${type}/validation/${eventId}`,
          });
        }
      } else {
        throw new TemporaryIdentityExpired();
      }
    } else {
      // TODO: Improve error.
      throw new Error("No user");
    }
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares(
  [withLogger, withSentry, withSession, withAuth],
  handler,
);
