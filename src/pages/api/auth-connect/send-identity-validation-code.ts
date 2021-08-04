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
import { isValidPhoneNumber } from "react-phone-number-input";

import { Handler } from "@src/@types/handler";
import { TemporaryIdentity } from "@src/@types/temporary-identity";
import { UserCookie } from "@src/@types/user-cookie";
import { insertTemporaryIdentity } from "@src/commands/insert-temporary-identity";
import { configVariables } from "@src/configs/config-variables";
import { formatAlertMessage, getLocaleFromRequest } from "@src/configs/intl";
import { logger } from "@src/configs/logger";
import { NoDBUserFoundError } from "@src/errors/errors";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { basicMiddlewares } from "@src/middlewares/basic-middlewares";
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { getIdentityType } from "@src/utils/get-identity-type";

const handler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityInputCantBeBlank: ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK,
    invalidPhoneNumberInput: ERRORS_DATA.INVALID_PHONE_NUMBER_INPUT,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    noUserFound: ERRORS_DATA.NO_USER_FOUND,
  };

  return getTracer().span(
    "send-identity-validation-code handler",
    async (span) => {
      const { callbackUrl, identityInput, identityToUpdateId } = request.body;

      if (!identityInput.value) {
        throw webErrorFactory(webErrors.identityInputCantBeBlank);
      }

      if (
        getIdentityType(identityInput.type) === IdentityTypes.PHONE &&
        !isValidPhoneNumber(identityInput.value)
      ) {
        throw webErrorFactory(webErrors.invalidPhoneNumberInput);
      }

      const userCookie = await getServerSideCookies<UserCookie>(request, {
        cookieName: "user-cookie",
        isCookieSealed: true,
        cookieSalt: configVariables.cookieSalt,
      });

      if (!userCookie) {
        response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        response.setHeader("location", "/");
        response.end();
        return;
      }

      const identity = {
        type: getIdentityType(identityInput.type),
        value: identityInput.value,
      };

      return await sendIdentityValidationCode(
        configVariables.managementCredentials,
        {
          callbackUrl,
          identity,
          localeCodeOverride: "en-EN",
          userId: userCookie.sub,
        },
      )
        .then(async ({ eventId }) => {
          span.setDisclosedAttribute("is validation code sent", true);

          let temporaryIdentity: TemporaryIdentity = {
            eventIds: [eventId],
            value: identityInput.value,
            type: identityInput.type,
            expiresAt: identityInput.expiresAt,
            primary: identityInput.primary,
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
            getIdentityType(identityInput.type) === IdentityTypes.EMAIL
              ? formatAlertMessage(locale, "confirmationCodeEmail")
              : formatAlertMessage(locale, "confirmationCodePhone");

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
            throw webErrorFactory(webErrors.identityInputCantBeBlank);
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
  "/api/auth-connect/send-identity-validation-code/",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
