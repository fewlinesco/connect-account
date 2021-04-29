import { getServerSideCookies, Endpoint, HttpStatus } from "@fwl/web";
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
import { initProfileClient } from "@src/configs/profile-client";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";
import { getProfileAccessToken } from "@src/utils/get-profile-access-token";

const handler: Handler = async (request, response) => {
  const webErrors = {
    invalidProfileToken: ERRORS_DATA.INVALID_PROFILE_TOKEN,
    invalidScopes: ERRORS_DATA.INVALID_SCOPES,
    profileDataNotFound: ERRORS_DATA.PROFILE_DATA_NOT_FOUND,
    unreachable: ERRORS_DATA.UNREACHABLE,
  };

  return getTracer().span("get-profile handler", async (span) => {
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

    const profileAccessToken = await getProfileAccessToken(
      userCookie.access_token,
    );

    span.setDisclosedAttribute(
      "is Connect.Profile access token available",
      true,
    );

    const profileClient = initProfileClient(profileAccessToken);

    const { data: profileUserInfo } = await profileClient
      .getProfile()
      .catch((error) => {
        span.setDisclosedAttribute(
          "is Connect.Profile user info fetched",
          false,
        );

        if (error.response.status === HttpStatus.UNAUTHORIZED) {
          throw webErrorFactory(webErrors.invalidProfileToken);
        }

        if (error.response.status === HttpStatus.FORBIDDEN) {
          throw webErrorFactory(webErrors.invalidScopes);
        }

        if (error.response.status === HttpStatus.NOT_FOUND) {
          throw webErrorFactory(webErrors.profileDataNotFound);
        }

        throw webErrorFactory(webErrors.unreachable);
      });

    span.setDisclosedAttribute("is Connect.Profile user info fetched", true);

    const { data: profileAddresses } = await profileClient
      .getAddresses()
      .catch((error) => {
        span.setDisclosedAttribute(
          "is Connect.Profile addresses fetched",
          false,
        );

        if (error.response.status === HttpStatus.UNAUTHORIZED) {
          throw webErrorFactory(webErrors.invalidProfileToken);
        }

        if (error.response.status === HttpStatus.FORBIDDEN) {
          throw webErrorFactory(webErrors.invalidScopes);
        }

        throw webErrorFactory(webErrors.unreachable);
      });

    span.setDisclosedAttribute("is Connect.Profile addresses fetched", true);

    response.statusCode = HttpStatus.OK;
    response.json({
      profileUserInfo,
      profileAddresses,
    });
  });
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
  "/api/profile/get-profile",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
