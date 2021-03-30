import {
  checkVerificationCode,
  CheckVerificationCodeStatus,
  ConnectUnreachableError,
  GraphqlErrors,
} from "@fewlines/connect-management";
import {
  Endpoint,
  getServerSideCookies,
  HttpStatus,
  setAlertMessagesCookie,
} from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { removeExpiredSudoEventIds } from "@src/commands/remove-expired-sudo-event-ids";
import { config } from "@src/config";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { NoDBUserFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { generateAlertMessage } from "@src/utils/generateAlertMessage";

const handler: Handler = async (request, response) => {
  const webErrors = {
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    sudoEventIdsNotFound: ERRORS_DATA.SUDO_EVENT_IDS_NOT_FOUND,
    sudoEventIdsListNotFound: ERRORS_DATA.SUDO_EVENT_IDS_LIST_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    invalidBody: ERRORS_DATA.INVALID_BODY,
    invalidValidationCode: ERRORS_DATA.INVALID_VALIDATION_CODE,
    noUserFound: ERRORS_DATA.NO_USER_FOUND,
  };

  return getTracer().span(
    "verify-two-fa-validation-code handler",
    async (span) => {
      const { verificationCode } = request.body;

      if (!verificationCode) {
        throw webErrorFactory(webErrors.invalidBody);
      }

      const userCookie = (await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: config.cookieSalt,
      })) as UserCookie;

      const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
        span.setDisclosedAttribute("database reachable", false);
        throw webErrorFactory({
          ...webErrors.databaseUnreachable,
          parentError: error,
        });
      });

      if (!user) {
        span.setDisclosedAttribute("user found", false);
        throw webErrorFactory(webErrors.noUserFound);
      }
      span.setDisclosedAttribute("user found", true);

      if (!user.sudo_event_ids) {
        span.setDisclosedAttribute("sudo event ids list found", false);
        throw webErrorFactory(webErrors.sudoEventIdsListNotFound);
      }
      span.setDisclosedAttribute("sudo event ids list found", true);

      const validEventIds = user.sudo_event_ids.filter(
        ({ event_id, expires_at }) => {
          return expires_at > Date.now() && event_id;
        },
      );

      await removeExpiredSudoEventIds(userCookie.sub, validEventIds).catch(
        (error) => {
          span.setDisclosedAttribute(
            "are expired sudo event ids removed",
            false,
          );

          if (error instanceof NoDBUserFoundError) {
            span.setDisclosedAttribute("user found", false);
            throw webErrorFactory({
              ...webErrors.noUserFound,
              parentError: error,
            });
          }

          span.setDisclosedAttribute("database reachable", false);
          throw webErrorFactory({
            ...webErrors.databaseUnreachable,
            parentError: error,
          });
        },
      );
      span.setDisclosedAttribute("are expired sudo event ids removed", true);

      if (!validEventIds.length) {
        span.setDisclosedAttribute("are valid sudo event ids found", false);
        setAlertMessagesCookie(response, [
          generateAlertMessage("Validation code has expired"),
        ]);
        throw webErrorFactory(webErrors.sudoEventIdsNotFound);
      }
      span.setDisclosedAttribute("are valid sudo event ids found", true);

      let validationStatus: CheckVerificationCodeStatus.VALID | undefined;

      for await (const { event_id } of validEventIds) {
        if (validationStatus === CheckVerificationCodeStatus.VALID) {
          break;
        }

        const { status: verifiedResult } = await checkVerificationCode(
          config.managementCredentials,
          {
            code: verificationCode,
            eventId: event_id,
          },
        ).catch((error) => {
          if (error instanceof GraphqlErrors) {
            throw webErrorFactory({
              ...webErrors.identityNotFound,
              parentError: error,
            });
          }

          if (error instanceof ConnectUnreachableError) {
            throw webErrorFactory({
              ...webErrors.connectUnreachable,
              parentError: error,
            });
          }

          throw error;
        });

        if (verifiedResult === CheckVerificationCodeStatus.VALID) {
          validationStatus = verifiedResult;
        }
      }

      if (!validationStatus) {
        span.setDisclosedAttribute("is vadalidation code valid", false);
        throw webErrorFactory(webErrors.invalidValidationCode);
      }
      span.setDisclosedAttribute("is vadalidation code valid", true);

      response.statusCode = HttpStatus.OK;
      response.end();
      return;
    },
  );
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, {
      windowMs: 300000,
      requestsUntilBlock: 200,
    }),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  handler,
  "/api/auth-connect/verify-two-fa-validation-code",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
