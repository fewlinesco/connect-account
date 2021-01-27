import { addIdentityToUser } from "@fewlines/connect-management";
import { checkVerificationCode } from "@fewlines/connect-management";
import { markIdentityAsPrimary } from "@fewlines/connect-management";
import { Endpoint, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/core/Handler";
import { UserCookie } from "@src/@types/user-cookie";
import { NoTemporaryIdentity, NoUserFound } from "@src/client-errors";
import { removeTemporaryIdentity } from "@src/commands/remove-temporary-identity";
import { config } from "@src/config";
import { logger } from "@src/logger";
import { withAuth } from "@src/middlewares/with-auth";
import { withSentry } from "@src/middlewares/with-sentry";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import getTracer from "@src/tracer";
import { getIdentityType } from "@src/utils/get-identity-type";
import { getServerSideCookies } from "@src/utils/server-side-cookies";

const tracer = getTracer();

const handler: Handler = async (request, response) => {
  return tracer.span("mark-identity-as-primary handler", async (span) => {
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
        span.setDisclosedAttribute("Is temporary Identity found", true);

        if (temporaryIdentity.expiresAt > Date.now()) {
          span.setDisclosedAttribute("Is temporary Identity expired", false);

          const { status: verificationStatus } = await checkVerificationCode(
            config.managementCredentials,
            {
              code: validationCode,
              eventId,
            },
          );

          const { value, type, primary } = temporaryIdentity;

          if (verificationStatus === "VALID") {
            span.setDisclosedAttribute("Is temporary Identity valid", true);

            const { id: identityId } = await addIdentityToUser(
              config.managementCredentials,
              {
                userId: userCookie.sub,
                identityType: getIdentityType(type),
                identityValue: value,
              },
            );

            if (primary) {
              span.setDisclosedAttribute("Is temporary Identity primary", true);

              await markIdentityAsPrimary(
                config.managementCredentials,
                identityId,
              );
            }

            span.setDisclosedAttribute("Is temporary Identity primary", false);

            await removeTemporaryIdentity(userCookie.sub, temporaryIdentity);

            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: "/account/logins",
            });

            return response.end();
          } else if (verificationStatus === "INVALID") {
            span.setDisclosedAttribute("Is temporary Identity valid", false);

            response.statusCode = HttpStatus.BAD_REQUEST;
            response.json({ error: verificationStatus });
            return;
          } else {
            response.writeHead(HttpStatus.TEMPORARY_REDIRECT, {
              Location: `/account/logins/${type}/validation/${eventId}`,
            });
          }
        } else {
          span.setDisclosedAttribute("Temporary Identity expired", true);

          await removeTemporaryIdentity(userCookie.sub, temporaryIdentity);

          response.statusCode = HttpStatus.BAD_REQUEST;
          response.json({ error: "Temporary Identity Expired" });
          return;
        }
      } else {
        span.setDisclosedAttribute("Is temporary Identity found", false);

        throw new NoTemporaryIdentity();
      }
    } else {
      throw new NoUserFound();
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
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
