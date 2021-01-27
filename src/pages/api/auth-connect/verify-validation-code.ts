import { addIdentityToUser } from "@fewlines/connect-management";
import { checkVerificationCode } from "@fewlines/connect-management";
import { markIdentityAsPrimary } from "@fewlines/connect-management";
import { HttpStatus } from "@fwl/web";

import { Handler } from "@src/@types/core/Handler";
import { UserCookie } from "@src/@types/user-cookie";
import { NoTemporaryIdentity, NoUserFound } from "@src/client-errors";
import { removeTemporaryIdentity } from "@src/commands/remove-temporary-identity";
import { config } from "@src/config";
import { withAuth } from "@src/middlewares/with-auth";
import { withLogger } from "@src/middlewares/with-logger";
import { withSentry } from "@src/middlewares/with-sentry";
import { wrapMiddlewares } from "@src/middlewares/wrapper";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { getIdentityType } from "@src/utils/get-identity-type";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

const handler: Handler = async (request, response) => {
  if (request.method === "POST") {
    const { validationCode, eventId } = request.body;

    const userCookie = (await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
    })) as UserCookie;

    const user = await getDBUserFromSub(userCookie.sub);

    if (user) {
      const temporaryIdentity = user.temporary_identities.find(
        (temporaryIdentity) => temporaryIdentity.eventId === eventId,
      );

      if (temporaryIdentity) {
        if (temporaryIdentity.expiresAt > Date.now()) {
          const { status: verificationStatus } = await checkVerificationCode(
            config.managementCredentials,
            {
              code: validationCode,
              eventId,
            },
          );

          const { value, type, primary } = temporaryIdentity;

          if (verificationStatus === "VALID") {
            const { id: identityId } = await addIdentityToUser(
              config.managementCredentials,
              {
                userId: userCookie.sub,
                identityType: getIdentityType(type),
                identityValue: value,
              },
            );

            if (primary) {
              await markIdentityAsPrimary(
                config.managementCredentials,
                identityId,
              );
            }

            await removeTemporaryIdentity(userCookie.sub, temporaryIdentity);

            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: "/account/logins",
            });

            return response.end();
          } else if (verificationStatus === "INVALID") {
            response.statusCode = HttpStatus.BAD_REQUEST;
            response.json({ error: verificationStatus });
            return;
          } else {
            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: `/account/logins/${type}/validation/${eventId}`,
            });
          }
        } else {
          await removeTemporaryIdentity(userCookie.sub, temporaryIdentity);

          response.statusCode = HttpStatus.BAD_REQUEST;
          response.json({ error: "Temporary Identity Expired" });
          return;
        }
      } else {
        throw new NoTemporaryIdentity();
      }
    } else {
      throw new NoUserFound();
    }
  }

  response.statusCode = HttpStatus.METHOD_NOT_ALLOWED;

  return Promise.reject();
};

export default wrapMiddlewares([withLogger, withSentry, withAuth], handler);
