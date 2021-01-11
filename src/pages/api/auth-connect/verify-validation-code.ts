import { HttpStatus } from "@fwl/web";

import { addIdentityToUser } from "@lib/commands/add-identity-to-user";
import { markIdentityAsPrimary } from "@lib/commands/mark-identity-as-primary";
import { checkVerificationCode } from "@lib/queries/check-verification-code";
import { Handler } from "@src/@types/core/Handler";
import { UserCookie } from "@src/@types/user-cookie";
import {
  NoDataReturned,
  NoIdentityAdded,
  NoTemporaryIdentity,
  NoUserFound,
} from "@src/client-errors";
import { removeTemporaryIdentity } from "@src/commands/remove-temporary-identity";
import { GraphqlErrors } from "@src/errors";
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
          const checkVerificationCodeResult = await checkVerificationCode(
            validationCode,
            eventId,
          ).then(({ errors, data }) => {
            if (errors) {
              throw new GraphqlErrors(errors);
            }

            if (!data) {
              throw new NoDataReturned();
            }

            return data.checkVerificationCode;
          });

          const { value, type, primary } = temporaryIdentity;

          if (checkVerificationCodeResult.status === "VALID") {
            const body = {
              userId: userCookie.sub,
              type: getIdentityType(type),
              value,
            };

            const identityId = await addIdentityToUser(body).then(
              ({ errors, data }) => {
                if (errors) {
                  throw new GraphqlErrors(errors);
                }

                if (!data) {
                  throw new NoIdentityAdded();
                }

                return data.addIdentityToUser.id;
              },
            );

            if (primary) {
              await markIdentityAsPrimary(identityId).then(({ errors }) => {
                if (errors) {
                  throw new GraphqlErrors(errors);
                }
              });
            }

            await removeTemporaryIdentity(userCookie.sub, temporaryIdentity);

            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: "/account/logins",
            });

            return response.end();
          } else if (checkVerificationCodeResult.status === "INVALID") {
            response.statusCode = HttpStatus.BAD_REQUEST;
            response.json({ error: checkVerificationCodeResult.status });
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
