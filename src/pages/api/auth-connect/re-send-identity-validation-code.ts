import {
  IdentityValueCantBeBlankError,
  sendIdentityValidationCode,
  IdentityAlreadyUsedError,
  IdentityTypes,
  ConnectUnreachableError,
} from "@fewlines/connect-management";
import { getTracer } from "@fwl/tracing";
import {
  Endpoint,
  HttpStatus,
  getServerSideCookies,
  setAlertMessagesCookie,
} from "@fwl/web";
import { wrapMiddlewares } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { UserCookie } from "@src/@types/user-cookie";
import { insertTemporaryIdentity } from "@src/commands/insert-temporary-identity";
import { CONFIG_VARIABLES } from "@src/configs/config-variables";
import { formatAlertMessage, getLocaleFromRequest } from "@src/configs/intl";
import { logger } from "@src/configs/logger";
import { NoDBUserFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { getDBUserFromSub } from "@src/queries/get-db-user-from-sub";
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { getIdentityType } from "@src/utils/get-identity-type";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityInputCantBeBLank: ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK,
    temporaryIdentityNotFound: ERRORS_DATA.TEMPORARY_IDENTITY_NOT_FOUND,
    temporaryIdentitiesNotFound: ERRORS_DATA.TEMPORARY_IDENTITY_LIST_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    noUserFound: ERRORS_DATA.NO_USER_FOUND,
  };

  return getTracer().span(
    "re-send-identity-validation-code handler",
    async (span) => {
      const { eventId } = request.body;

      if (!eventId) {
        throw webErrorFactory(webErrors.badRequest);
      }

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: CONFIG_VARIABLES.cookieSalt,
      });

      if (!userCookie) {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        return response.end();
      }

      const user = await getDBUserFromSub(userCookie.sub).catch((error) => {
        span.setDisclosedAttribute("database reachable", false);
        throw webErrorFactory({
          ...webErrors.databaseUnreachable,
          parentError: error,
        });
      });

      if (!user?.temporary_identities) {
        span.setDisclosedAttribute("user found", false);
        throw webErrorFactory(webErrors.temporaryIdentitiesNotFound);
      }
      span.setDisclosedAttribute("user found", true);

      const temporaryIdentity = user.temporary_identities.find(
        ({ eventIds }) => {
          if (eventIds) {
            return eventIds.find((inDbEventId) => inDbEventId === eventId);
          }

          return;
        },
      );

      if (!temporaryIdentity) {
        span.setDisclosedAttribute("is temporary Identity found", false);
        throw webErrorFactory(webErrors.temporaryIdentityNotFound);
      }
      span.setDisclosedAttribute("is temporary Identity found", true);

      const { type, value, expiresAt, primary, eventIds, identityToUpdateId } =
        temporaryIdentity;

      const identity = {
        type: getIdentityType(type),
        value: value,
      };

      return await sendIdentityValidationCode(
        CONFIG_VARIABLES.managementCredentials,
        {
          callbackUrl: "/",
          identity,
          localeCodeOverride: "en-EN",
          userId: userCookie.sub,
        },
      )
        .then(async ({ eventId }) => {
          span.setDisclosedAttribute("is validation code sent", true);
          let temporaryIdentity: TemporaryIdentity = {
            eventIds: [...eventIds, eventId],
            value,
            type,
            expiresAt,
            primary,
          };

          if (identityToUpdateId) {
            temporaryIdentity = {
              ...temporaryIdentity,
              identityToUpdateId,
            };
          }

          await insertTemporaryIdentity(
            userCookie.sub,
            temporaryIdentity,
          ).catch((error) => {
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

          const locale = getLocaleFromRequest(request, span);
          const localizedAlertMessageString =
            getIdentityType(type) === IdentityTypes.EMAIL
              ? formatAlertMessage(locale, "newConfirmationCodeEmail")
              : formatAlertMessage(locale, "newConfirmationCodePhone");

          setAlertMessagesCookie(response, [
            generateAlertMessage(localizedAlertMessageString),
          ]);

          response.statusCode = HttpStatus.OK;
          response.setHeader("Content-Type", "application/json");
          response.json({ eventId });
          return;
        })
        .catch((error) => {
          span.setDisclosedAttribute("is validation code sent", false);

          if (error instanceof IdentityAlreadyUsedError) {
            throw webErrorFactory(webErrors.badRequest);
          }

          if (error instanceof IdentityValueCantBeBlankError) {
            throw webErrorFactory(webErrors.identityInputCantBeBLank);
          }

          if (error instanceof ConnectUnreachableError) {
            throw webErrorFactory({
              ...webErrors.connectUnreachable,
              parentError: error,
            });
          }

          throw error;
        });
    },
  );
};

const wrappedHandler = wrapMiddlewares(
  basicMiddlewares(getTracer(), logger),
  handler,
  "/api/auth-connect/re-send-identity-validation-code/",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
