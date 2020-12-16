import { HttpStatus } from "@fwl/web";
import { Handler } from "next-iron-session";

import { addIdentityToUser } from "@lib/commands/addIdentityToUser";
import { markIdentityAsPrimary } from "@lib/commands/markIdentityAsPrimary";
import { checkVerificationCode } from "@lib/queries/checkVerificationCode";
import { UserCookie } from "@src/@types/UserCookie";
import type { ExtendedRequest } from "@src/@types/core/ExtendedRequest";
import {
  NoDataReturned,
  NoIdentityAdded,
  NoTemporaryIdentity,
  NoUserFound,
} from "@src/clientErrors";
import { removeTemporaryIdentity } from "@src/commands/removeTemporaryIdentity";
import { GraphqlErrors } from "@src/errors";
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

    const userCookie = request.session.get<UserCookie>(
      "user-cookie",
    ) as UserCookie;

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
            response.statusMessage = checkVerificationCodeResult.status;
            response.end();
            return;
          } else {
            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: `/account/logins/${type}/validation/${eventId}`,
            });
          }
        } else {
          await removeTemporaryIdentity(userCookie.sub, temporaryIdentity);

          response.statusCode = HttpStatus.BAD_REQUEST;
          response.statusMessage = "Temporary Identity Expired";
          response.end();
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

export default wrapMiddlewares(
  [withLogger, withSentry, withSession, withAuth],
  handler,
);
