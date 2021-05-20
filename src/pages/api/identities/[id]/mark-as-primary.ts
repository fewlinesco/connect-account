import {
  ConnectUnreachableError,
  GraphqlErrors,
  IdentityTypes,
  markIdentityAsPrimary,
} from "@fewlines/connect-management";
import {
  getServerSideCookies,
  Endpoint,
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
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import rateLimitingConfig from "@src/configs/rate-limiting-config";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { generateAlertMessage } from "@src/utils/generate-alert-message";
import { getIdentityType } from "@src/utils/get-identity-type";
import { isMarkingIdentityAsPrimaryAuthorized } from "@src/utils/is-marking-identity-as-primary-authorized";

const markAsPrimary: Handler = async (request, response) => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
    identityNotFound: ERRORS_DATA.IDENTITY_NOT_FOUND,
    connectUnreachable: ERRORS_DATA.CONNECT_UNREACHABLE,
    invalidBody: ERRORS_DATA.INVALID_BODY,
  };

  return getTracer().span("mark-identity-as-primary handler", async (span) => {
    const { id: identityId } = request.query as { [key: string]: string };

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

    const isAuthorized = await isMarkingIdentityAsPrimaryAuthorized(
      userCookie.sub,
      identityId,
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

    if (!isAuthorized) {
      span.setDisclosedAttribute(
        "is mark Identity as primary authorized",
        false,
      );

      throw webErrorFactory(webErrors.badRequest);
    }

    span.setDisclosedAttribute("is mark Identity as primary authorized", true);

    return markIdentityAsPrimary(
      configVariables.managementCredentials,
      identityId,
    )
      .then((identity) => {
        span.setDisclosedAttribute("is Identity marked as primary", true);

        const alertMessage =
          getIdentityType(identity.type) === IdentityTypes.EMAIL
            ? `${identity.value} is now your primary email`
            : `${identity.value} is now your primary phone number`;

        setAlertMessagesCookie(response, [generateAlertMessage(alertMessage)]);

        response.statusCode = HttpStatus.OK;
        response.setHeader("Content-type", "application/json");
        response.end();
        return;
      })
      .catch((error) => {
        span.setDisclosedAttribute("is Identity marked as primary", false);

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
  });
};

const markAsPrimaryWrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, rateLimitingConfig),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  markAsPrimary,
  "/api/identities/[id]/mark-as-primary",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .post(markAsPrimaryWrappedHandler)
  .getHandler();
