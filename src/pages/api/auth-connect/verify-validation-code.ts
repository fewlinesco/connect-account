import {
  addIdentityToUser,
  getIdentity,
  removeIdentityFromUser,
} from "@fewlines/connect-management";
import { checkVerificationCode } from "@fewlines/connect-management";
import { markIdentityAsPrimary } from "@fewlines/connect-management";
import { Endpoint, HttpStatus, getServerSideCookies } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { removeTemporaryIdentity } from "@src/commands/remove-temporary-identity";
import { config } from "@src/config";
import { NoTemporaryIdentity, NoUserFoundError } from "@src/errors";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import getTracer from "@src/tracer";
import { getIdentityType } from "@src/utils/get-identity-type";

const tracer = getTracer();

const handler: Handler = async (request, response) => {
  return tracer.span("verify-validation-code handler", async (span) => {
    const { validationCode, eventId } = request.body;

    const userCookie = (await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: config.cookieSalt,
    })) as UserCookie;

    const user = await getDBUserFromSub(userCookie.sub);

    if (user) {
      const temporaryIdentity = user.temporary_identities.find(
        (temporaryIdentity) => temporaryIdentity.eventId === eventId,
      );

      if (temporaryIdentity) {
        span.setDisclosedAttribute("is temporary Identity found", true);

        if (temporaryIdentity.expiresAt > Date.now()) {
          span.setDisclosedAttribute("is temporary Identity expired", false);

          const { status: verificationStatus } = await checkVerificationCode(
            config.managementCredentials,
            {
              code: validationCode,
              eventId,
            },
          );

          const {
            value,
            type,
            primary,
            identityToUpdateId,
          } = temporaryIdentity;

          if (verificationStatus === "VALID") {
            span.setDisclosedAttribute("is temporary Identity valid", true);

            const { id: identityId } = await addIdentityToUser(
              config.managementCredentials,
              {
                userId: userCookie.sub,
                identityType: getIdentityType(type),
                identityValue: value,
              },
            );

            if (primary) {
              span.setDisclosedAttribute("is temporary Identity primary", true);

              await markIdentityAsPrimary(
                config.managementCredentials,
                identityId,
              );
            }

            span.setDisclosedAttribute("is temporary Identity primary", false);

            await removeTemporaryIdentity(userCookie.sub, temporaryIdentity);

            if (identityToUpdateId) {
              const identityToUpdate = await getIdentity(
                config.managementCredentials,
                { userId: userCookie.sub, identityId: identityToUpdateId },
              );

              await removeIdentityFromUser(config.managementCredentials, {
                userId: userCookie.sub,
                identityType: getIdentityType(type),
                identityValue: identityToUpdate ? identityToUpdate.value : "",
              });
            }

            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: "/account/logins",
            });

            return response.end();
          } else if (verificationStatus === "INVALID") {
            span.setDisclosedAttribute("is temporary Identity valid", false);

            response.statusCode = HttpStatus.BAD_REQUEST;
            response.json({ error: verificationStatus });
            return;
          } else {
            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: `/account/logins/${type}/validation/${eventId}`,
            });
          }
        } else {
          span.setDisclosedAttribute("temporary Identity expired", true);

          await removeTemporaryIdentity(userCookie.sub, temporaryIdentity);

          response.statusCode = HttpStatus.BAD_REQUEST;
          response.json({ error: "Temporary Identity Expired" });
          return;
        }
      } else {
        span.setDisclosedAttribute("is temporary Identity found", false);

        throw new NoTemporaryIdentity();
      }
    } else {
      throw new NoUserFoundError();
    }
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(tracer),
    recoveryMiddleware(tracer),
    errorMiddleware(tracer),
    loggingMiddleware(tracer, logger),
    withSentry,
    withAuth,
  ],
  handler,
  "/api/auth-connect/verify-validation-code",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
