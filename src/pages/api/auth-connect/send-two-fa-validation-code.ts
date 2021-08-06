import {
  IdentityValueCantBeBlankError,
  IdentityTypes,
  ConnectUnreachableError,
  sendTwoFAVerificationCode,
  InvalidIdentityTypeError,
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

import { SudoEventId } from "@src/@types/dynamo-user";
import { Handler } from "@src/@types/handler";
import { UserCookie } from "@src/@types/user-cookie";
import { insertSudoEventId } from "@src/commands/insert-sudo-event-id";
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
    identityInputCantBeBlank: ERRORS_DATA.IDENTITY_INPUT_CANT_BE_BLANK,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    databaseUnreachable: ERRORS_DATA.DATABASE_UNREACHABLE,
    noUserFound: ERRORS_DATA.NO_USER_FOUND,
    invalidIdentityType: ERRORS_DATA.INVALID_IDENTITY_TYPE,
  };

  return getTracer().span(
    "send-two-fa-validation-code handler",
    async (span) => {
      const { callbackUrl, identityInput } = request.body;

      if (!identityInput.value) {
        throw webErrorFactory(webErrors.identityInputCantBeBlank);
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

      return await sendTwoFAVerificationCode(
        configVariables.managementCredentials,
        {
          callbackUrl: callbackUrl || "/",
          identity,
          localeCodeOverride: "en-EN",
          userId: userCookie.sub,
        },
      )
        .then(async ({ eventId }) => {
          span.setDisclosedAttribute("is verification code sent", true);

          const sudoEventId: SudoEventId = {
            event_id: eventId,
            expires_at: Date.now() + 300000,
          };

          await insertSudoEventId(userCookie.sub, sudoEventId).catch(
            (error) => {
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
          span.setDisclosedAttribute("is verification code sent", false);

          if (error instanceof InvalidIdentityTypeError) {
            throw webErrorFactory(webErrors.invalidIdentityType);
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
  "/api/auth-connect/send-two-fa-validation-code/",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(wrappedHandler)
  .getHandler();
