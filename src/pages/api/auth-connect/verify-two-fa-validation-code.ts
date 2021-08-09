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
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { insertSudoModeTTL } from "@src/commands/insert-sudo-mode-ttl";
import { removeExpiredSudoEventIds } from "@src/commands/remove-expired-sudo-event-ids";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { formatAlertMessage, getLocaleFromRequest } from "@src/configs/intl";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { NoDBUserFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { generateAlertMessage } from "@src/utils/generate-alert-message";

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

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: CONFIG_VARIABLES.cookieSalt,
      });

      if (!userCookie) {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        response.end();
        return;
      }

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

      if (!user.sudo.sudo_event_ids) {
        span.setDisclosedAttribute("sudo event ids list found", false);
        throw webErrorFactory(webErrors.sudoEventIdsListNotFound);
      }
      span.setDisclosedAttribute("sudo event ids list found", true);

      const validEventIds = user.sudo.sudo_event_ids.filter(
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

        const locale = getLocaleFromRequest(request, span);
        setAlertMessagesCookie(response, [
          generateAlertMessage(
            formatAlertMessage(locale, "validationCodeExpired"),
          ),
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
          CONFIG_VARIABLES.managementCredentials,
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
        span.setDisclosedAttribute("is validation code valid", false);
        throw webErrorFactory(webErrors.invalidValidationCode);
      }
      span.setDisclosedAttribute("is validation code valid", true);

      await insertSudoModeTTL(userCookie.sub).catch((error) => {
        span.setDisclosedAttribute("is sudo mode ttl set", false);

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
      });
      span.setDisclosedAttribute("is sudo mode ttl set", true);

      response.statusCode = HttpStatus.OK;
      response.json({ isCodeVerified: true });
      return;
    },
  );
};

const wrappedHandler = wrapMiddlewares(
  basicMiddlewares(getTracer(), logger),
  handler,
  "/api/auth-connect/verify-two-fa-validation-code/",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
